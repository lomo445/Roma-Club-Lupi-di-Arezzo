import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendBrevoEmail, EMAIL_TEMPLATES } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Errore Webhook Stripe:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    
    const subscriptionIdsStr = session.metadata?.subscriptionIds;
    if (subscriptionIdsStr) {
      const subscriptionIds = subscriptionIdsStr.split(',');
      
      // Aggiorna lo stato di tutti gli abbonamenti
      await prisma.subscription.updateMany({
        where: { id: { in: subscriptionIds } },
        data: { 
          status: "ACTIVE",
          stripeSessionId: session.id 
        }
      });

      // Invia l'email di benvenuto a tutti gli utenti associati agli abbonamenti pagati
      const subs = await prisma.subscription.findMany({
        where: { id: { in: subscriptionIds } },
        include: { user: true }
      });

      for (const sub of subs) {
        await sendBrevoEmail({
          to: [{ email: sub.user.email, name: `${sub.user.name} ${sub.user.surname}` }],
          subject: "Roma Club Arezzo - Pagamento Confermato! 🐺",
          htmlContent: EMAIL_TEMPLATES.welcome(sub.user.name, false)
        }).catch(err => console.error("Errore email benvenuto Stripe:", err));
      }
      
      console.log(`[Stripe Webhook] Attivati ${subscriptionIds.length} abbonamenti.`);
    }
  }

  return new NextResponse(null, { status: 200 });
}
