"use server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import bcrypt from "bcryptjs";
import { sendBrevoEmail, EMAIL_TEMPLATES } from "@/lib/email";
import { getSettingsAction } from "@/app/actions/settings";
import { headers } from "next/headers";

export async function registerUserAction(data: any) {
  try {
    const createdSubscriptionIds: string[] = [];
    const createdUsers: any[] = [];
    
    // Leggi impostazioni globali (Stagione e Prezzi)
    const settings = await getSettingsAction();
    const priceMap = {
      "Adulto": settings.priceAdult,
      "Ridotto": settings.priceReduced,
      "Familiare": settings.priceFamily
    };
    let totalPrice = 0;
    const lineItems: any[] = [];

    // Validazione base
    if (!data.members || data.members.length === 0) {
      return { success: false, error: "Devi inserire almeno un iscritto." };
    }

    // Per determinare il ruolo (solo se è compilata la chiave)
    let isAdminGlobal = false;
    if (data.isDirettivo && data.chiaveSegreta === "LUPI26") {
      isAdminGlobal = true;
    }

    // Processa ogni membro
    for (let i = 0; i < data.members.length; i++) {
      const member = data.members[i];
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
        const dateStr = member.dataNascita;
        if (dateStr.includes("/") || dateStr.includes("-")) {
          const sep = dateStr.includes("/") ? "/" : "-";
          const parts = dateStr.split(sep);
          if (parts[0].length === 2 && parts[2].length === 4) { // DD/MM/YYYY
            birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`);
          } else {
            birthDate = new Date(dateStr); // fallback se era YYYY-MM-DD
          }
        } else {
          birthDate = new Date(dateStr);
        }
      }

      const maxMember = await prisma.user.aggregate({
        _max: { memberNumber: true }
      });
      
      let nextMemberNumber = 2;
      if (maxMember._max.memberNumber && maxMember._max.memberNumber >= 1) {
        nextMemberNumber = maxMember._max.memberNumber + 1;
      }

      let currentRole = "USER";
      if (isAdminGlobal) {
        if (!data.direttivoMemberIndex || data.direttivoMemberIndex === "ALL") {
          currentRole = "ADMIN";
        } else if (String(i) === data.direttivoMemberIndex) {
          currentRole = "ADMIN";
        }
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
          role: currentRole as "USER" | "ADMIN",
          memberNumber: nextMemberNumber
        }
      });

      createdUsers.push(user);

      const price = priceMap[member.tipoTessera as keyof typeof priceMap] || 65;
      totalPrice += price;

      const sub = await prisma.subscription.create({
        data: {
          userId: user.id,
          season: settings.season,
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

    // Costruisci il dominio dinamico per i link
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // Se il metodo è Stripe, creiamo la Checkout Session
    if (data.metodoPagamento === "Stripe") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${baseUrl}/login?checkout=success`,
        cancel_url: `${baseUrl}/iscriviti`,
        metadata: {
          subscriptionIds: createdSubscriptionIds.join(','),
        },
      });

      return { success: true, checkoutUrl: session.url };
    } else {
      // Per i pagamenti in Contanti, invio subito email di benvenuto con avviso
      for (const u of createdUsers) {
        await sendBrevoEmail({
          to: [{ email: u.email, name: `${u.name} ${u.surname}` }],
          subject: "Roma Club Arezzo - Benvenuto!",
          htmlContent: EMAIL_TEMPLATES.welcome(u.name, true, `${baseUrl}/login`)
        }).catch(err => console.error("Errore invio email benvenuto contanti:", err));
      }
    }

    // Se è contanti, finisce qui.
    return { success: true };
  } catch (e: any) {
    console.error("Registrazione fallita:", e);
    return { success: false, error: "Errore interno durante la registrazione." };
  }
}
