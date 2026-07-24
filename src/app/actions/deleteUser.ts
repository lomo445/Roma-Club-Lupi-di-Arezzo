"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function deleteUserAction(userId: string) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== "ADMIN") {
      return { success: false, error: "Non autorizzato." };
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Errore durante l'eliminazione:", error);
    return { success: false, error: "Errore interno durante l'eliminazione." };
  }
}
