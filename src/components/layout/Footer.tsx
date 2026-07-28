export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-8 border-t-4 border-secondary mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Roma Club "Lupi di Arezzo"</h3>
          <p className="text-zinc-400">
            Intitolato a <strong>Romolo Brizzi</strong>.<br/>
            Sede ufficiale: <strong>Circolo Oasi Chiani</strong><br/>
            Ponte a Chiani 1, Arezzo.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Link Utili</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/chi-siamo" className="hover:text-secondary transition-colors">Chi Siamo</a></li>
            <li><a href="/iscriviti" className="hover:text-secondary transition-colors">Tesseramento</a></li>
            <li><a href="/login" className="hover:text-secondary transition-colors">Area Soci</a></li>
            <li><a href="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contatti</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span>📧</span> 
              <a href="mailto:romaclublupidiarezzo@gmail.com" className="hover:text-secondary transition-colors">romaclublupidiarezzo@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <span>📍</span>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Circolo+Oasi+Chiani+Arezzo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors underline underline-offset-2"
              >
                Apri in Mappe
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Roma Club Lupi di Arezzo "Romolo Brizzi". Tutti i diritti riservati.</p>
      </div>
    </footer>
  );
}
