"use server";

import { prisma } from "@/lib/prisma";

export async function verifyAdultAction(nameToSearch: string) {
  if (!nameToSearch || nameToSearch.length < 3) return { exists: false };

  try {
    // Carichiamo tutti i soci (in un club le numeriche permettono un check in memoria molto più flessibile)
    const allUsers = await prisma.user.findMany({ 
      include: { subscriptions: true }
    });

    const searchTarget = nameToSearch.replace(/\s+/g, "").toLowerCase();

    const matchedUsers = allUsers.filter(u => {
      const fullName = (u.name + u.surname).toLowerCase().replace(/\s+/g, "");
      const fullNameInv = (u.surname + u.name).toLowerCase().replace(/\s+/g, "");
      return fullName === searchTarget || fullNameInv === searchTarget;
    });

    // Controlliamo se almeno uno degli utenti trovati ha un abbonamento Adulto
    const hasAdultSub = matchedUsers.some(u => 
      u.subscriptions.some(s => s.type === "Adulto")
    );

    return { exists: hasAdultSub };
  } catch (error) {
    console.error("Errore verifyAdultAction:", error);
    return { exists: false };
  }
}
