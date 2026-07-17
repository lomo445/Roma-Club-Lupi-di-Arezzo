import Link from 'next/link';
import Image from 'next/image';
import { auth } from "@/auth";

export async function Navbar() {
  const session = await auth();
  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 w-full border-b border-border/40 shadow-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
          <div className="relative w-56 h-16">
            {/* Il logo verrà caricato qui. Ho impostato le proporzioni per il logo orizzontale che mi hai inviato */}
            <Image 
              src="/logo.png" 
              alt="Roma Club Lupi di Arezzo" 
              fill 
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center space-x-3 text-sm font-bold">
          <Link href="/" className="px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
            Home
          </Link>
          <Link href="/chi-siamo" className="px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
            Chi Siamo
          </Link>
          <Link href="/iscriviti" className="px-4 py-2 rounded-md bg-secondary text-black shadow-md hover:bg-yellow-400 transition-colors">
            Iscriviti
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <Link 
              href="/dashboard" 
              className="text-sm font-bold bg-white text-primary px-4 py-2 rounded-md hover:bg-zinc-200 transition-all shadow-md"
            >
              Il tuo Profilo
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-bold border-2 border-white/80 px-4 py-2 rounded-md hover:bg-white hover:text-primary transition-all shadow-sm"
            >
              Area Riservata
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
