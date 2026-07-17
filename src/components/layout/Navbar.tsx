import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 w-full border-b border-border/40 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          {/* Sostituire con next/image e il logo reale */}
          <div className="bg-secondary text-secondary-foreground font-bold rounded-full w-10 h-10 flex items-center justify-center">
            LA
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">
            Roma Club Arezzo
          </span>
        </Link>

        <div className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <Link href="/chi-siamo" className="hover:text-secondary transition-colors">
            Chi Siamo
          </Link>
          <Link href="/iscriviti" className="hover:text-secondary transition-colors">
            Iscriviti
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="text-sm font-medium hover:text-secondary transition-colors"
          >
            Area Riservata
          </Link>
        </div>
      </div>
    </nav>
  );
}
