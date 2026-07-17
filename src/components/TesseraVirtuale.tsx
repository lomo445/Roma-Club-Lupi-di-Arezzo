"use client";

import QRCode from "react-qr-code";

interface TesseraVirtualeProps {
  memberNumber: number;
  name: string;
}

export function TesseraVirtuale({ memberNumber, name }: TesseraVirtualeProps) {
  // Il QR code contiene un URL o un payload JSON verificabile dall'app scanner dell'Admin.
  // Es: un link al check-in con l'ID utente.
  const qrData = JSON.stringify({ action: "check-in", memberNumber, timestamp: Date.now() });

  return (
    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl p-6 text-white max-w-sm mx-auto relative overflow-hidden">
      {/* Pattern decorativo */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="text-secondary font-extrabold text-xl tracking-tight">LUPI DI AREZZO</div>
          <div className="text-xs uppercase tracking-wider opacity-80">Roma Club Ufficiale</div>
        </div>
        <div className="bg-white p-1 rounded">
           {/* In una vera app qui c'è il logo */}
           <div className="w-8 h-8 bg-secondary text-primary font-bold flex items-center justify-center text-xs">ASR</div>
        </div>
      </div>

      <div className="flex justify-center mb-8 relative z-10">
        <div className="bg-white p-3 rounded-xl shadow-inner">
          <QRCode value={qrData} size={150} fgColor="#8A1538" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="text-xs uppercase opacity-80 mb-1">Socio Tesserato</div>
        <div className="text-2xl font-bold mb-2">{name}</div>
        <div className="flex justify-between items-end border-t border-white/20 pt-4 mt-4">
          <div>
            <div className="text-xs opacity-80">Numero Tessera</div>
            <div className="font-mono text-lg">{String(memberNumber).padStart(4, '0')}</div>
          </div>
          <div className="text-secondary font-bold">Stagione 25/26</div>
        </div>
      </div>
    </div>
  );
}
