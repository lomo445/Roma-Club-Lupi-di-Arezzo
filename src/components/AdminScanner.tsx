"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { recordAttendanceAction } from "@/app/actions/recordAttendance";
import { CloudOff, RefreshCw } from "lucide-react";

type EventType = { id: string; title: string; date: Date };

export function AdminScanner({ events }: { events: EventType[] }) {
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadOfflineCount();
  }, []);

  const loadOfflineCount = () => {
    const offlineScans = JSON.parse(localStorage.getItem("offlineScans") || "[]");
    setOfflineCount(offlineScans.length);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const offlineScans = JSON.parse(localStorage.getItem("offlineScans") || "[]");
    if (offlineScans.length === 0) {
      setIsSyncing(false);
      return;
    }
    
    const remainingScans = [];
    let successCount = 0;
    
    for (const scan of offlineScans) {
       try {
         const res = await recordAttendanceAction(scan.memberNumber, scan.eventId);
         // Se success o se "già registrato", lo togliamo dalla coda
         if (res.success || res.error?.includes("già registrato") || res.error?.includes("non trovato")) {
            successCount++;
         } else {
            remainingScans.push(scan);
         }
       } catch (e) {
         // Errore di rete, lo manteniamo
         remainingScans.push(scan);
       }
    }
    
    localStorage.setItem("offlineScans", JSON.stringify(remainingScans));
    loadOfflineCount();
    setIsSyncing(false);
    
    if (remainingScans.length === 0) {
       alert(`Tutte le ${successCount} scansioni offline sincronizzate con successo!`);
    } else {
       alert(`Sincronizzate ${successCount} scansioni. Ne rimangono ${remainingScans.length} bloccate (riprova più tardi).`);
    }
  };

  useEffect(() => {
    if (!isScanning || !selectedEventId) return;

    // Configura e avvia lo scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = async (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText);
        if (!data.memberNumber) throw new Error("Invalid QR");
        
        try {
          const res = await recordAttendanceAction(data.memberNumber, selectedEventId);
          
          if (res.success) {
            setScanResult({ success: true, memberNumber: res.user?.memberNumber, name: `${res.user?.name} ${res.user?.surname}` });
          } else {
            setScanResult({ error: res.error });
          }
        } catch (networkError) {
           // SALVATAGGIO OFFLINE
           const offlineScans = JSON.parse(localStorage.getItem("offlineScans") || "[]");
           // Evita doppioni identici nella coda locale
           const exists = offlineScans.find((s: any) => s.memberNumber === data.memberNumber && s.eventId === selectedEventId);
           if (!exists) {
             offlineScans.push({ memberNumber: data.memberNumber, eventId: selectedEventId, timestamp: Date.now() });
             localStorage.setItem("offlineScans", JSON.stringify(offlineScans));
             loadOfflineCount();
           }
           setScanResult({ success: true, warning: "Connessione assente. Salvato Offline.", memberNumber: data.memberNumber });
        }

      } catch (e) {
        setScanResult({ error: "QR Code non valido o non riconosciuto" });
      }
      
      // Mettiamo in pausa lo scanner per un attimo per non floodare le chiamate
      scanner.pause(true);
      setTimeout(() => {
        setScanResult(null);
        scanner.resume();
      }, 3000);
    };

    scanner.render(onScanSuccess, () => {});

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [isScanning, selectedEventId]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-primary p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-zinc-800">Scanner (Check-in)</h2>
        
        {offlineCount > 0 && (
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 font-bold py-2 px-4 rounded-full text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <CloudOff size={16} />}
            Sincronizza {offlineCount} offline
          </button>
        )}
      </div>
      
      {!isScanning ? (
        <div className="flex flex-col space-y-4 mb-8">
          <label className="font-bold text-zinc-700">Seleziona l'Evento:</label>
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="p-3 border border-zinc-300 rounded-lg outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Seleziona una partita o evento --</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsScanning(true)}
            disabled={!selectedEventId}
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            Avvia Fotocamera
          </button>
        </div>
      ) : (
        <div className="mb-4 text-center">
          <button 
            onClick={() => { setIsScanning(false); setScanResult(null); }}
            className="text-sm font-bold text-zinc-500 hover:text-red-500 mb-4"
          >
            Ferma Scanner / Cambia Evento
          </button>
          <div id="reader" className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50"></div>
        </div>
      )}

      {scanResult && (
        <div className={`p-4 rounded-lg text-center font-bold ${scanResult.error ? 'bg-red-100 text-red-800' : scanResult.warning ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {scanResult.error ? (
            <p>{scanResult.error}</p>
          ) : (
            <div>
              <p className="text-sm uppercase mb-1">{scanResult.warning || "Check-in Effettuato!"}</p>
              <p className="text-xl">Socio #{scanResult.memberNumber} {scanResult.name ? `- ${scanResult.name}` : ""}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
