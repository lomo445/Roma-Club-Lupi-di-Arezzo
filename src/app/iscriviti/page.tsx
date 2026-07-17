import { IscrizioneForm } from '@/components/IscrizioneForm';

export const metadata = {
  title: 'Tesseramento | Roma Club Lupi di Arezzo',
  description: 'Unisciti al Roma Club Lupi di Arezzo. Compila il modulo per la stagione in corso.',
};

export default function IscrivitiPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-800 mb-4">Campagna Tesseramenti</h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Con la tessera Lupi di Arezzo avrai la tua card personale, gadget esclusivi, 
            e il diritto di partecipare a tutte le attività, trasferte e visioni delle partite in sede.
          </p>
        </div>
        
        <IscrizioneForm />
      </div>
    </div>
  );
}
