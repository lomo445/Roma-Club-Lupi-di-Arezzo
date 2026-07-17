import Link from 'next/link';

export const metadata = {
  title: 'Chi Siamo | Roma Club Lupi di Arezzo',
  description: 'La storia, il direttivo e la sede del Roma Club Romolo Brizzi - Lupi di Arezzo',
};

export default function ChiSiamo() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Page */}
      <section className="bg-zinc-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Chi Siamo</h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            La storia, la passione e i volti del Roma Club "Romolo Brizzi" - Lupi di Arezzo.
          </p>
        </div>
      </section>

      {/* Storia */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg prose-zinc mx-auto">
            <h2 className="text-3xl font-bold text-zinc-800 mb-6">La nostra storia</h2>
            <p className="text-zinc-600 mb-4 leading-relaxed">
              Il Roma Club "Lupi di Arezzo" nasce dalla passione travolgente per i colori giallorossi di un gruppo di amici aretini. 
              Intitolato a "Romolo Brizzi", il club rappresenta un punto di riferimento per tutti i tifosi della AS Roma 
              residenti nella provincia di Arezzo e dintorni.
            </p>
            <p className="text-zinc-600 mb-4 leading-relaxed">
              Il nostro obiettivo principale è aggregare i tifosi per sostenere la squadra, organizzare trasferte 
              e guardare le partite insieme in sede, trasmettendo la nostra immensa fede giallorossa 
              anche a chilometri di distanza dalla Capitale.
            </p>
            
            <h2 className="text-3xl font-bold text-zinc-800 mt-12 mb-6">La Sede</h2>
            <p className="text-zinc-600 mb-4 leading-relaxed">
              La nostra sede, il "covo" dei Lupi, è dotata di schermo, area bar, sciarpe storiche e tutto ciò che serve 
              per vivere i 90 minuti di passione nel migliore dei modi. È il luogo dove ci ritroviamo non solo per le partite, 
              ma anche per cene sociali, riunioni del direttivo ed eventi speciali.
            </p>
            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-200 my-8">
              <h3 className="font-bold text-lg mb-2">Indirizzo Sede</h3>
              <p className="text-zinc-600 font-medium">Circolo Oasi Chiani</p>
              <p className="text-zinc-600">Ponte a Chiani 1, Arezzo (AR)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Direttivo */}
      <section className="bg-zinc-50 py-16 px-4 border-t border-zinc-200">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-800 mb-12">Il Direttivo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Presidente */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 flex flex-col items-center">
              <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                LR
              </div>
              <h3 className="text-xl font-bold text-zinc-800">Leonardo Romanazzo</h3>
              <p className="text-primary font-medium text-sm mt-1">Presidente</p>
            </div>

            {/* Membri Direttivo */}
            {[
              "Giovanni Lorito", 
              "Elpidio Monaco", 
              "Sophia Porchiella", 
              "Nadia Tellini", 
              "Massimo Pierfederici", 
              "Gianluca Brizzi", 
              "Andrea Germani"
            ].map((name, idx) => {
              const initials = name.split(" ").map(n => n[0]).join("");
              return (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 flex flex-col items-center">
                  <div className="w-24 h-24 bg-zinc-200 text-zinc-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                    {initials}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-800">{name}</h3>
                  <p className="text-zinc-500 font-medium text-sm mt-1">Membro del Direttivo</p>
                </div>
              );
            })}

          </div>
          
          <div className="mt-16">
            <Link 
              href="/iscriviti" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 inline-block"
            >
              Unisciti al Branco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
