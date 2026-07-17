"use server";
import { prisma } from "@/lib/prisma";

export async function updateMemberNumberAction(userId: string, newNumber: number) {
  try {
    const existing = await prisma.user.findUnique({
      where: { memberNumber: newNumber }
    });

    if (existing && existing.id !== userId) {
      return { success: false, error: "Questo numero di tessera è già assegnato a un altro socio." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { memberNumber: newNumber }
    });

    return { success: true };
  } catch (e: any) {
    console.error("Errore modifica numero tessera:", e);
    return { success: false, error: "Errore interno durante il salvataggio." };
  }
}
