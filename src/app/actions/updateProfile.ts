"use server";
import { prisma } from "@/lib/prisma";

export async function updateProfileAction(userId: string, data: any) {
  try {
    let birthDate = undefined;
    if (data.dataNascita) {
      birthDate = new Date(data.dataNascita);
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.nome,
        surname: data.cognome,
        phone: data.telefono,
        birthPlace: data.luogoNascita,
        ...(birthDate && { birthDate })
      }
    });

    return { success: true };
  } catch (e: any) {
    console.error("Modifica profilo fallita:", e);
    return { success: false, error: "Errore interno durante il salvataggio dei dati." };
  }
}
