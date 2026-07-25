"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { sendBrevoEmail, EMAIL_TEMPLATES } from "@/lib/email";
import { headers } from "next/headers";

export async function sendReminderAction(userId: string) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return { success: false, error: "Non autorizzato." };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true }
    });

    if (!user) return { success: false, error: "Socio non trovato." };

    const sub = user.subscriptions[0];
    if (!sub || sub.status !== "PENDING") {
      return { success: false, error: "Il socio non ha abbonamenti in sospeso." };
    }
    
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const loginLink = `${protocol}://${host}/login`;

    const res = await sendBrevoEmail({
      to: [{ email: user.email, name: `${user.name} ${user.surname}` }],
      subject: "Roma Club Arezzo - Completa la tua iscrizione! 💛❤️",
      htmlContent: EMAIL_TEMPLATES.reminder(user.name, sub.price, loginLink)
    });

    if (res.success) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { reminderSent: true }
      });
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }

  } catch (error: any) {
    console.error("Errore invio sollecito:", error);
    return { success: false, error: "Errore interno durante l'invio del sollecito." };
  }
}
