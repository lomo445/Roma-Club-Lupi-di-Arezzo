interface EmailPayload {
  to: { email: string; name: string }[];
  subject: string;
  htmlContent: string;
}

export async function sendBrevoEmail({ to, subject, htmlContent }: EmailPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || "info@romaclubarezzo.it";
  const senderName = "Roma Club Arezzo";

  if (!apiKey) {
    console.warn("⚠️ BREVO_API_KEY mancante. Email non inviata a:", to.map(t => t.email).join(', '));
    return { success: false, error: "API Key mancante" };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to,
        subject,
        htmlContent
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Errore da Brevo:", errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Errore fetch Brevo:", error);
    return { success: false, error: error.message };
  }
}

export const EMAIL_TEMPLATES = {
  welcome: (name: string, isCash: boolean) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #8C1C13; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Benvenuto nel Roma Club Arezzo! 🐺</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Ciao <strong>${name}</strong>,</p>
        <p>Siamo felicissimi di averti con noi! La tua registrazione è andata a buon fine.</p>
        ${isCash 
          ? `<p style="background-color: #ffe0b2; padding: 10px; border-left: 4px solid #ff9800;"><strong>Nota importante:</strong> Hai scelto il pagamento in Contanti. La tua tessera e il tuo QR Code saranno attivati solo dopo che avrai saldato l'importo presso la nostra sede.</p>`
          : `<p>Il tuo pagamento è confermato. Puoi già accedere alla tua area personale e visualizzare la tua tessera digitale ufficiale!</p>`
        }
        <p>Accedi alla tua area personale per vedere il tuo QR Code:</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://romaclubarezzo.vercel.app'}/login" style="display: inline-block; background-color: #E3B044; color: #8C1C13; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Accedi ora</a>
      </div>
    </div>
  `,
  reminder: (name: string, amount: number) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #8C1C13; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Completa la tua iscrizione! 💛❤️</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Ciao <strong>${name}</strong>,</p>
        <p>Abbiamo notato che hai iniziato la registrazione al Roma Club Arezzo ma l'abbonamento risulta ancora <strong>In Attesa</strong> (importo: ${amount} €).</p>
        <p>Per attivare definitivamente la tua tessera e ricevere il tuo QR code personale, per favore completa il pagamento.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://romaclubarezzo.vercel.app'}/login" style="display: inline-block; background-color: #E3B044; color: #8C1C13; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Vai al tuo profilo</a>
      </div>
    </div>
  `
};
