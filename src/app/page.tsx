import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-32 px-4 overflow-hidden">
        <Image 
          src="/stadio-olimpico.jpg" 
          alt="Stadio Olimpico Pieno" 
          fill 
          priority 
          className="object-cover z-0" 
        />
        <div className="absolute inset-0 bg-black/60 z-0"></div> {/* Overlay per contrasto */}
        <div className="container mx-auto relative z-10 text-center mt-8">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 drop-shadow-2xl">
            LUPI DI AREZZO
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-8 drop-shadow-lg uppercase tracking-wide">
            Roma Club "Romolo Brizzi"
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-3xl mx-auto drop-shadow-md leading-relaxed text-zinc-200">
            La Roma non si discute, si ama. <br/>
            Unisciti al branco: i posti in sede per le notti di Champions e sul pullman per l'Olimpico <strong className="text-white">vanno a ruba</strong>!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/iscriviti" 
              className="bg-secondary text-black hover:bg-yellow-400 text-xl font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(255,184,28,0.4)] transition-all hover:scale-105"
            >
              Tesseramento 26/27
            </Link>
            <Link 
              href="/chi-siamo" 
              className="bg-transparent border-2 border-white/80 hover:bg-white/10 text-xl font-bold py-4 px-10 rounded-full shadow-lg transition-all hover:scale-105"
            >
              Vieni in Sede
            </Link>
          </div>
        </div>
      </section>

      {/* Sezione Prossima Partita & News */}
      <section className="py-20 px-4 bg-zinc-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Prossima Partita & Calendario */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-primary h-full">
              <h2 className="text-3xl font-bold text-primary mb-6 flex items-center">
                <span className="bg-primary/10 p-2 rounded-lg mr-4">🗓</span> Calendario 2026/2027
              </h2>
              <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-xl border border-zinc-100 mb-6">
                <div className="text-sm font-semibold text-zinc-500 mb-2 uppercase tracking-wider">
                  Stagione 26/27 - Serie A & Champions
                </div>
                <div className="text-lg font-medium text-zinc-700 text-center">
                  I calendari ufficiali non sono ancora stati sorteggiati.<br/>
                  <span className="text-sm text-zinc-500 mt-2 block">Torna a trovarci a Luglio per tutte le date!</span>
                </div>
              </div>
              <div className="p-4 bg-secondary/20 rounded-xl border border-secondary/30 text-center">
                <p className="font-bold text-primary">📍 Sede Visiva: Circolo Oasi di Chiani</p>
                <p className="text-sm text-zinc-700 mt-1">Vieni a vedere le partite sul nostro maxischermo!</p>
              </div>
            </div>

            {/* Ultime News */}
            <div>
              <h2 className="text-3xl font-bold text-zinc-800 mb-6">Comunicazioni</h2>
              <div className="space-y-6">
                
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-zinc-100">
                  <div className="text-sm text-secondary font-bold mb-2">Apertura Tesseramenti</div>
                  <h3 className="text-xl font-bold text-zinc-800 mb-2">Campagna Abbonamenti 25/26</h3>
                  <p className="text-zinc-600 mb-4">
                    È ufficialmente aperta la campagna tesseramenti per la nuova stagione sportiva. Assicurati il tuo posto e i gadget esclusivi del club.
                  </p>
                  <Link href="/iscriviti" className="text-primary font-semibold hover:underline">
                    Scopri di più &rarr;
                  </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-zinc-100">
                  <div className="text-sm text-zinc-500 font-bold mb-2">Organizzazione</div>
                  <h3 className="text-xl font-bold text-zinc-800 mb-2">Notti di Champions & Trasferte</h3>
                  <p className="text-zinc-600 mb-4">
                    Ci stiamo già organizzando per la prossima emozionante stagione. I pullman per l'Olimpico si riempiono in un attimo, preparati a tesserarti!
                  </p>
                  <Link href="/login" className="text-primary font-semibold hover:underline">
                    Accedi all'area soci &rarr;
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
