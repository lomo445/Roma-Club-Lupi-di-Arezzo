"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { stripe } from "@/lib/stripe";

export async function registerUserAction(data: any) {
  try {
    const createdSubscriptionIds: string[] = [];
    const priceMap = {
      "Adulto": 65,
      "Ridotto": 35,
      "Familiare": 35
    };
    let totalPrice = 0;
    const lineItems: any[] = [];

    // Validazione base
    if (!data.members || data.members.length === 0) {
      return { success: false, error: "Devi inserire almeno un iscritto." };
    }

    // Per determinare il ruolo (solo se è compilata la chiave)
    let role = "USER";
    if (data.isDirettivo && data.chiaveSegreta === "LUPI26") {
      role = "ADMIN";
    }

    // Processa ogni membro
    for (const member of data.members) {
      const existingUser = await prisma.user.findUnique({
        where: { email: member.email }
      });
      if (existingUser) {
        return { success: false, error: `L'email ${member.email} è già registrata nel sistema.` };
      }

      const hashedPassword = await bcrypt.hash(member.password, 10);
      const names = member.nomeCognome.split(" ");
      const name = names[0];
      const surname = names.slice(1).join(" ") || "";
      
      let birthDate = null;
      if (member.dataNascita) {
        birthDate = new Date(member.dataNascita);
      }

      const maxMember = await prisma.user.aggregate({
        _max: { memberNumber: true }
      });
      
      let nextMemberNumber = 2;
      if (maxMember._max.memberNumber && maxMember._max.memberNumber >= 1) {
        nextMemberNumber = maxMember._max.memberNumber + 1;
      }

      const user = await prisma.user.create({
        data: {
          email: member.email,
          password: hashedPassword,
          name: name,
          surname: surname,
          phone: member.telefono,
          birthPlace: member.luogoNascita,
          birthDate: birthDate,
          gender: member.sesso,
          role: role as "USER" | "ADMIN",
          memberNumber: nextMemberNumber
        }
      });

      const price = priceMap[member.tipoTessera as keyof typeof priceMap] || 65;
      totalPrice += price;

      const sub = await prisma.subscription.create({
        data: {
          userId: user.id,
          season: "2026/2027",
          type: member.tipoTessera,
          price: price,
          method: data.metodoPagamento,
          status: "PENDING" // Sempre pending fino a pagamento o approvazione admin
        }
      });

      createdSubscriptionIds.push(sub.id);

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Tesseramento Roma Club Lupi di Arezzo - ${member.tipoTessera}`,
            description: `Socio: ${name} ${surname}`,
          },
          unit_amount: price * 100, // In centesimi
        },
        quantity: 1,
      });
    }

    // Se il metodo è Stripe, creiamo la Checkout Session
    if (data.metodoPagamento === "Stripe") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/login?checkout=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/iscriviti`,
        metadata: {
          subscriptionIds: createdSubscriptionIds.join(','),
        },
      });

      return { success: true, checkoutUrl: session.url };
    }

    // Se è contanti, finisce qui.
    return { success: true };
  } catch (e: any) {
    console.error("Registrazione fallita:", e);
    return { success: false, error: "Errore interno durante la registrazione." };
  }
}
