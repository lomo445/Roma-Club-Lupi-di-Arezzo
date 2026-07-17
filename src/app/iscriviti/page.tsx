import { IscrizioneForm } from '@/components/IscrizioneForm';
import Image from 'next/image';

export const metadata = {
  title: 'Tesseramento | Roma Club Lupi di Arezzo',
  description: 'Unisciti al Roma Club Lupi di Arezzo. Compila il modulo per la stagione in corso.',
};

export default function IscrivitiPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <div className="relative h-64 w-full">
        <Image 
          src="/stadio-olimpico.jpg" 
          alt="Stadio Olimpico" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-md">Tesseramento 26/27</h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl text-zinc-200">
            Assicurati il tuo posto al Circolo Oasi di Chiani e ottieni la prelazione per le trasferte.
          </p>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-12 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 border-t-8 border-secondary max-w-3xl mx-auto">
          <IscrizioneForm />
        </div>
      </div>
    </div>
  );
}
