import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TesseraVirtuale } from "@/components/TesseraVirtuale";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-primary pb-24 pt-12 px-4 shadow-inner">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-white/20 pb-6">
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-md">
                Ciao, {user.name}
              </h1>
              <p className="text-zinc-200 mt-2 font-medium">
                {isAdmin ? "Pannello di Controllo Direttivo" : "La tua Area Riservata Socio"}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 -mt-16 relative z-10 pb-12">

        {isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard/admin/soci" className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow group">
              <div className="text-primary text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">👥</div>
              <h2 className="text-2xl font-bold text-zinc-800 mb-2">Gestione Soci</h2>
              <p className="text-zinc-600">Visualizza, filtra e approva le tessere dei membri del club. Esporta la lista in CSV.</p>
            </Link>

            <Link href="/dashboard/admin/scanner" className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow group">
              <div className="text-primary text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">📱</div>
              <h2 className="text-2xl font-bold text-zinc-800 mb-2">Scanner Check-in</h2>
              <p className="text-zinc-600">Avvia la fotocamera per scansionare le tessere virtuali e registrare le presenze agli eventi.</p>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 flex justify-center md:justify-start">
              <TesseraVirtuale 
                name={user.name || "Socio"} 
                memberNumber={user.memberNumber || 1} 
              />
            </div>
            <div className="md:col-span-8 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                <h3 className="text-xl font-bold text-zinc-800 mb-4">Stato Abbonamento</h3>
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <div>
                    <div className="font-bold text-green-800">Tessera Attiva</div>
                    <div className="text-sm text-green-600">Valida per l'intera stagione 25/26</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
                <h3 className="text-xl font-bold text-zinc-800 mb-4">Le tue presenze</h3>
                <div className="text-center py-8 text-zinc-500">
                  <span className="text-4xl font-bold text-primary block mb-2">0</span>
                  presenze registrate in questa stagione
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
