import Link from 'next/link';
import Image from 'next/image';
import { auth } from "@/auth";

export async function Navbar() {
  const session = await auth();
  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 w-full border-b border-border/40 shadow-xl">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3 md:h-20 md:py-0 gap-4 md:gap-0">
        <Link href="/" className="flex items-center space-x-3 transition-transform hover:scale-105 shrink-0">
          <div className="relative w-48 h-12 md:w-56 md:h-16">
            <Image 
              src="/logo.png" 
              alt="Roma Club Lupi di Arezzo" 
              fill 
              className="object-contain"
            />
          </div>
        </Link>



        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm font-bold w-full lg:w-auto">
          <Link href="/" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            Home
          </Link>
          <Link href="/chi-siamo" className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">
            Chi Siamo
          </Link>
          <Link href="/iscriviti" className="px-3 py-2 rounded-md bg-secondary text-black shadow-md hover:bg-yellow-400 transition-colors">
            Iscriviti
          </Link>
          
          {session ? (
            <Link 
              href="/dashboard" 
              className="bg-white text-primary px-3 py-2 rounded-md hover:bg-zinc-200 transition-all shadow-md ml-auto md:ml-0"
            >
              Il tuo Profilo
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="border-2 border-white/80 px-3 py-2 rounded-md hover:bg-white hover:text-primary transition-all shadow-sm ml-auto md:ml-0"
            >
              Area Riservata
            </Link>
          )}
        </div>
      </div>

      {/* Marquee Ticker (Visibile ovunque, inclusi smartphone) */}
      <div className="w-full bg-black/20 overflow-hidden relative flex items-center h-8 border-t border-white/10">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none"></div>
        <div className="animate-marquee font-black text-secondary tracking-widest flex items-center gap-6 text-[10px] sm:text-xs uppercase opacity-90">
          <span>🐺 FORZA ROMA</span>
          <span className="text-white">❤️💛</span>
          <span>LUPI DI AREZZO</span>
          <span className="text-white">❤️💛</span>
          <span>🐺 FORZA ROMA</span>
          <span className="text-white">❤️💛</span>
          <span>LUPI DI AREZZO</span>
          <span className="text-white">❤️💛</span>
          <span>🐺 SEMPRE AL TUO FIANCO</span>
          <span className="text-white">❤️💛</span>
          <span>LUPI DI AREZZO</span>
        </div>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none"></div>
      </div>
    </nav>
  );
}
