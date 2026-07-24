import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";
import { User, Phone, MapPin, Calendar, CreditCard, CheckCircle, XCircle } from "lucide-react";

export default async function DettaglioSocioPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { subscriptions: true }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border-t-4 border-red-500">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-zinc-800 mb-2">Socio non trovato</h1>
          <p className="text-zinc-600 mb-6">Il socio che stai cercando non esiste o è stato rimosso.</p>
          <Link href="/dashboard/admin/soci" className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition">
            Torna all'elenco
          </Link>
        </div>
      </div>
    );
  }

  const sub = user.subscriptions[0];
  const qrData = JSON.stringify({ memberNumber: user.memberNumber });

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/dashboard/admin/soci" className="text-sm font-bold text-zinc-500 hover:text-primary transition-colors flex items-center gap-2">
            &larr; Torna all'elenco soci
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLONNA SINISTRA: Dati e QR */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border-t-4 border-primary p-6 text-center">
              <div className="w-24 h-24 mx-auto bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <User size={40} className="text-zinc-400" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-800">{user.name} {user.surname}</h1>
              <p className="text-zinc-500 mb-4">{user.email}</p>
              
              <div className="inline-block bg-primary text-white font-bold px-4 py-1 rounded-full text-sm mb-6">
                Tessera N° {user.memberNumber}
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-200 inline-block shadow-sm">
                <QRCode value={qrData} size={150} level="H" />
              </div>
              <p className="text-xs text-zinc-400 mt-3 font-medium">QR Code Ufficiale Socio</p>
            </div>
          </div>

          {/* COLONNA DESTRA: Dettagli */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Anagrafica */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
              <h3 className="text-lg font-bold text-zinc-800 mb-4 flex items-center gap-2 border-b pb-2">
                <User size={20} className="text-primary" /> Anagrafica
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500 flex items-center gap-1"><Phone size={14}/> Telefono</p>
                  <p className="font-semibold text-zinc-800">{user.phone || "N/D"}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 flex items-center gap-1"><Calendar size={14}/> Data di Nascita</p>
                  <p className="font-semibold text-zinc-800">
                    {user.birthDate ? new Date(user.birthDate).toLocaleDateString("it-IT") : "N/D"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500 flex items-center gap-1"><MapPin size={14}/> Luogo di Nascita</p>
                  <p className="font-semibold text-zinc-800">{user.birthPlace || "N/D"}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Sesso</p>
                  <p className="font-semibold text-zinc-800">{user.gender || "N/D"}</p>
                </div>
              </div>
            </div>

            {/* Abbonamento */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
              <h3 className="text-lg font-bold text-zinc-800 mb-4 flex items-center gap-2 border-b pb-2">
                <CreditCard size={20} className="text-primary" /> Dettagli Tesseramento
              </h3>
              
              {sub ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-zinc-500">Stagione</p>
                    <p className="font-bold text-zinc-800">{sub.season}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Tipo Tessera</p>
                    <p className="font-bold text-zinc-800">{sub.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Importo</p>
                    <p className="font-bold text-zinc-800">{sub.price} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Metodo di Pagamento</p>
                    <p className="font-bold text-zinc-800">{sub.method}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-zinc-500 mb-1">Stato Abbonamento</p>
                    {sub.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
                        <CheckCircle size={16} /> Attivo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full text-sm">
                        In Attesa (PENDING)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 italic">Nessun abbonamento registrato per questo socio.</p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
