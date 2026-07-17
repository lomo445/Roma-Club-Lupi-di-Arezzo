export const metadata = {
  title: 'Privacy Policy | Roma Club Lupi di Arezzo',
  description: 'Informativa sulla Privacy del Roma Club Romolo Brizzi - Lupi di Arezzo',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-4">
      <div className="container mx-auto max-w-4xl bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-100">
        <h1 className="text-4xl font-bold text-zinc-900 mb-8 border-b pb-4">Informativa sulla Privacy</h1>
        
        <div className="prose prose-zinc max-w-none">
          <p>
            Ai sensi del <strong>Regolamento UE 2016/679 (GDPR)</strong>, il <strong>Roma Club Lupi di Arezzo "Romolo Brizzi"</strong> 
            fornisce le seguenti informazioni in merito al trattamento dei dati personali forniti al momento dell'iscrizione.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Titolare del Trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati è il Roma Club Lupi di Arezzo "Romolo Brizzi", con sede presso Circolo Oasi Chiani, Ponte a Chiani 1, Arezzo. 
            Email di contatto: <strong>romaclublupidiarezzo@gmail.com</strong>.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Finalità del Trattamento</h2>
          <p>
            I dati personali raccolti (Nome, Cognome, Data e Luogo di Nascita, Email, Telefono, Sesso) vengono trattati per le seguenti finalità:
          </p>
          <ul>
            <li>Gestione del tesseramento e archiviazione soci.</li>
            <li>Comunicazioni istituzionali relative ad attività del Club (trasferte, riunioni, eventi in sede).</li>
            <li>Elaborazioni statistiche interne in forma anonima e aggregata.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Base Giuridica del Trattamento</h2>
          <p>
            Il trattamento dei dati si fonda sull'esecuzione del contratto associativo di cui l'interessato è parte 
            (il tesseramento al Club) e sul consenso esplicito fornito al momento della compilazione del form.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Destinatari dei Dati e Sicurezza</h2>
          <p>
            I Suoi dati non verranno in alcun modo diffusi o ceduti a terzi per scopi di marketing. 
            Potranno essere comunicati agli Enti preposti per adempimenti di legge o assicurativi. 
            I dati sono custoditi su database sicuri e in conformità agli standard di sicurezza informatica odierni.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Diritti dell'Interessato</h2>
          <p>
            In ogni momento, Lei potrà esercitare i diritti previsti dagli art. 15-22 del GDPR, ovvero: 
            chiedere l'accesso, la rettifica, la cancellazione dei dati, la limitazione del trattamento o opporsi ad esso. 
            Le richieste possono essere inviate via email a <strong>romaclublupidiarezzo@gmail.com</strong>.
          </p>

          <p className="mt-8 text-sm text-zinc-500">
            Ultimo aggiornamento: Luglio 2026
          </p>
        </div>
      </div>
    </div>
  );
}
