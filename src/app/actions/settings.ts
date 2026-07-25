"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getSettingsAction() {
  let settings = await prisma.clubSettings.findUnique({ where: { id: "singleton" } });
  
  if (!settings) {
    settings = await prisma.clubSettings.create({
      data: {
        id: "singleton",
        season: "2026/2027",
        priceAdult: 65.0,
        priceReduced: 35.0,
        priceFamily: 35.0
      }
    });
  }
  return settings;
}

export async function updateSettingsAction(data: {
  season: string;
  priceAdult: number;
  priceReduced: number;
  priceFamily: number;
}) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return { success: false, error: "Non autorizzato." };
  }

  try {
    await prisma.clubSettings.upsert({
      where: { id: "singleton" },
      update: {
        season: data.season,
        priceAdult: data.priceAdult,
        priceReduced: data.priceReduced,
        priceFamily: data.priceFamily
      },
      create: {
        id: "singleton",
        season: data.season,
        priceAdult: data.priceAdult,
        priceReduced: data.priceReduced,
        priceFamily: data.priceFamily
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Errore salvataggio impostazioni:", error);
    return { success: false, error: "Errore durante il salvataggio." };
  }
}
