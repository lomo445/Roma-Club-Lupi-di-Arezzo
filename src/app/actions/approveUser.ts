"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function approveUserAction(userId: string) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return { success: false, error: "Non autorizzato." };
    }

    // Trova l'abbonamento pending dell'utente
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: { where: { status: "PENDING" } } }
    });

    if (!user || user.subscriptions.length === 0) {
      return { success: false, error: "Nessun abbonamento in sospeso trovato per questo socio." };
    }

    const sub = user.subscriptions[0];

    // Aggiorna lo stato ad ACTIVE
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "ACTIVE" }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Errore approvazione manuale:", error);
    return { success: false, error: "Errore interno durante l'approvazione." };
  }
}
