import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

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
      
      console.log(`[Stripe Webhook] Attivati ${subscriptionIds.length} abbonamenti.`);
    }
  }

  return new NextResponse(null, { status: 200 });
}
