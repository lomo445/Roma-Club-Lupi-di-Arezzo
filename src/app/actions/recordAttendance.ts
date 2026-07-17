"use server";
import { prisma } from "@/lib/prisma";

export async function recordAttendanceAction(memberNumber: number, eventId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { memberNumber }
    });

    if (!user) {
      return { success: false, error: "Nessun socio trovato con questo numero di tessera." };
    }

    // Check if already registered
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId
        }
      }
    });

    if (existing) {
      return { success: false, error: "Questo socio è già stato registrato per questo evento." };
    }

    await prisma.attendance.create({
      data: {
        userId: user.id,
        eventId
      }
    });

    return { success: true, user: { name: user.name, surname: user.surname, memberNumber: user.memberNumber } };
  } catch (e: any) {
    console.error("Errore registrazione presenza:", e);
    return { success: false, error: "Errore interno del server durante la registrazione." };
  }
}
