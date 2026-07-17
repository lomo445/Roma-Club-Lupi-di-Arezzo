export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-8 border-t-4 border-secondary mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Roma Club Arezzo</h3>
          <p className="text-sm">
            Club Ufficiale AS Roma "Romolo Brizzi" - Lupi di Arezzo. 
            Sempre al fianco dei nostri colori.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Link Utili</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/chi-siamo" className="hover:text-secondary transition-colors">Chi Siamo</a></li>
            <li><a href="/iscriviti" className="hover:text-secondary transition-colors">Tesseramento</a></li>
            <li><a href="/login" className="hover:text-secondary transition-colors">Area Soci</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contatti</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: info@lupidarezzo.it</li>
            <li>Sede: Arezzo, Italia</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} Roma Club Lupi di Arezzo. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
