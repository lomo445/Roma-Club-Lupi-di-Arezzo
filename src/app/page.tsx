import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0"></div> {/* Overlay per leggibilità */}
        {/* Placeholder per l'immagine di sfondo: si può aggiungere un'immagine reale con next/image e layout="fill" in seguito */}
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Roma Club <span className="text-secondary">Lupi di Arezzo</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-10 max-w-2xl mx-auto drop-shadow-md">
            Romolo Brizzi - La tana dei tifosi giallorossi nel cuore della Toscana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/iscriviti" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Tesseramento 25/26
            </Link>
            <Link 
              href="/chi-siamo" 
              className="bg-transparent border-2 border-white hover:bg-white/10 text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Scopri il Club
            </Link>
          </div>
        </div>
      </section>

      {/* Sezione Prossima Partita & News */}
      <section className="py-20 px-4 bg-zinc-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Prossima Partita */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-primary">
              <h2 className="text-3xl font-bold text-primary mb-6 flex items-center">
                <span className="bg-primary/10 p-2 rounded-lg mr-4">⚽</span> Prossima Partita
              </h2>
              <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="text-sm font-semibold text-zinc-500 mb-4 uppercase tracking-wider">
                  Serie A - Prossimo Turno
                </div>
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="text-2xl font-bold">AS ROMA</div>
                  <div className="text-zinc-400 font-bold text-xl">VS</div>
                  <div className="text-2xl font-bold">AVVERSARIO</div>
                </div>
                <div className="text-lg font-medium text-zinc-700">
                  Data e Ora da definire
                </div>
                <div className="mt-6 text-sm text-center text-zinc-500">
                  Vieni a vederla con noi in sede! Ingresso riservato ai tesserati.
                </div>
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
                  <h3 className="text-xl font-bold text-zinc-800 mb-2">Trasferta a Roma</h3>
                  <p className="text-zinc-600 mb-4">
                    Stiamo organizzando i pullman per le prossime partite all'Olimpico. Maggiori dettagli verranno comunicati ai soci tramite l'area riservata e WhatsApp.
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
