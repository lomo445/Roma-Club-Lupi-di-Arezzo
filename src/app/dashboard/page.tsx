import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TesseraVirtuale } from "@/components/TesseraVirtuale";
import { LogoutButton } from "@/components/LogoutButton";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  let stats = null;
  if (isAdmin) {
    const totalUsers = await prisma.user.count({ where: { role: "USER" } });
    const maleUsers = await prisma.user.count({ where: { gender: "Maschio" } });
    const femaleUsers = await prisma.user.count({ where: { gender: "Femmina" } });
    
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    const minors = await prisma.user.count({
      where: {
        birthDate: {
          gt: eighteenYearsAgo,
        }
      }
    });

    const subStats = await prisma.subscription.groupBy({
      by: ['method'],
      where: { status: 'ACTIVE' },
      _sum: {
        price: true
      }
    });
    
    const totalRevenue = subStats.reduce((acc, curr) => acc + (curr._sum.price || 0), 0);
    const cashRevenue = subStats.find(s => s.method === "Contanti")?._sum.price || 0;
    const stripeRevenue = subStats.find(s => s.method === "Stripe")?._sum.price || 0;

    stats = { totalUsers, maleUsers, femaleUsers, minors, totalRevenue, cashRevenue, stripeRevenue };
  }

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
          <div className="space-y-8">
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

            {stats && (
              <div className="bg-white p-8 rounded-2xl shadow-md border-t-8 border-secondary">
                <h2 className="text-2xl font-black text-zinc-800 mb-6 border-b pb-4">Riepilogo Contabile e Demografico</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Sezione Demografica */}
                  <div className="space-y-4 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Popolazione Soci</h3>
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                      <span className="text-zinc-600 font-medium">Totale Tesserati</span>
                      <span className="text-2xl font-black text-zinc-800">{stats.totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                      <span className="text-zinc-600 font-medium">Di cui Minorenni</span>
                      <span className="text-xl font-bold text-orange-500">{stats.minors}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                      <span className="text-zinc-600 font-medium">Uomini</span>
                      <span className="text-xl font-bold text-blue-600">{stats.maleUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 font-medium">Donne</span>
                      <span className="text-xl font-bold text-pink-500">{stats.femaleUsers}</span>
                    </div>
                  </div>

                  {/* Sezione Contabile */}
                  <div className="space-y-4 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                    <h3 className="text-xl font-bold text-green-600 mb-4">Cassa & Pagamenti</h3>
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                      <span className="text-zinc-600 font-medium">Incasso Totale</span>
                      <span className="text-2xl font-black text-green-700">€{stats.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                      <span className="text-zinc-600 font-medium">Pagati in Contanti</span>
                      <span className="text-xl font-bold text-zinc-800">€{stats.cashRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 font-medium">Pagati Online (Stripe)</span>
                      <span className="text-xl font-bold text-indigo-600">€{stats.stripeRevenue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
