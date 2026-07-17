"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export function AdminScanner() {
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    // Configura e avvia lo scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText);
        setScanResult(data);
        // Qui in un'app vera si farebbe una chiamata API per registrare la presenza:
        // fetch('/api/attendances', { method: 'POST', body: decodedText })
      } catch (e) {
        setScanResult({ error: "QR Code non valido" });
      }
      // scanner.clear(); // Opzionale se vogliamo fermarlo al primo scan
    };

    scanner.render(onScanSuccess, () => {});

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-primary p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-zinc-800 mb-6 text-center">Scanner Tessere (Check-in)</h2>
      
      <div id="reader" className="mb-8 overflow-hidden rounded-xl"></div>

      {scanResult && (
        <div className={`p-4 rounded-lg text-center font-bold ${scanResult.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {scanResult.error ? (
            <p>{scanResult.error}</p>
          ) : (
            <div>
              <p className="text-sm uppercase mb-1">Check-in Effettuato!</p>
              <p className="text-2xl">Socio #{scanResult.memberNumber}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
