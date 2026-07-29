"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function toggleDirettivoAction(userId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return { success: false, error: "Non autorizzato" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "Utente non trovato" };

  const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
  
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath(`/dashboard/admin/soci/${userId}`);
  return { success: true, newRole };
}

export async function adminResetPasswordAction(userId: string, newPassword: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { success: false, error: "Non autorizzato" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  return { success: true };
}

export async function adminChangePaymentMethodAction(subId: string, newMethod: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { success: false, error: "Non autorizzato" };

  await prisma.subscription.update({
    where: { id: subId },
    data: { method: newMethod }
  });

  revalidatePath('/', 'layout'); 
  return { success: true };
}
