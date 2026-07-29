"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function resumeStripePaymentAction() {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Non autenticato" };
  
  const userId = session.user.id;

  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "PENDING", method: "Stripe" }
  });

  if (!sub) return { success: false, error: "Nessun abbonamento in sospeso trovato" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "Utente non trovato" };

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Tesseramento Roma Club Lupi di Arezzo - ${sub.type}`,
            description: `Socio: ${user.name} ${user.surname}`,
          },
          unit_amount: sub.price * 100, // In centesimi
        },
        quantity: 1,
      }
    ],
    mode: 'payment',
    success_url: `${baseUrl}/login?checkout=success`,
    cancel_url: `${baseUrl}/dashboard`,
    metadata: {
      subscriptionIds: sub.id,
    },
  });

  return { success: true, checkoutUrl: stripeSession.url };
}
