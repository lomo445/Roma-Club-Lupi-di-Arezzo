"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { recordAttendanceAction } from "@/app/actions/recordAttendance";

type EventType = { id: string; title: string; date: Date };

export function AdminScanner({ events }: { events: EventType[] }) {
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

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
        
        const res = await recordAttendanceAction(data.memberNumber, selectedEventId);
        
        if (res.success) {
          setScanResult({ success: true, memberNumber: res.user?.memberNumber, name: `${res.user?.name} ${res.user?.surname}` });
        } else {
          setScanResult({ error: res.error });
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
      <h2 className="text-2xl font-bold text-zinc-800 mb-6 text-center">Scanner Tessere (Check-in)</h2>
      
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
        <div className={`p-4 rounded-lg text-center font-bold ${scanResult.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {scanResult.error ? (
            <p>{scanResult.error}</p>
          ) : (
            <div>
              <p className="text-sm uppercase mb-1">Check-in Effettuato!</p>
              <p className="text-xl">Socio #{scanResult.memberNumber} - {scanResult.name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
