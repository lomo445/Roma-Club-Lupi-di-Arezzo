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

export async function adminUpdateMemberDataAction(userId: string, data: {
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  birthPlace?: string | null;
  gender?: string | null;
  memberNumber?: number | null;
}) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return { success: false, error: "Non autorizzato" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "Socio non trovato" };

    const name = data.name?.trim();
    const surname = data.surname?.trim();
    if (!name || !surname) {
      return { success: false, error: "Nome e Cognome sono obbligatori." };
    }

    const cleanEmail = data.email?.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, error: "Inserisci un indirizzo email valido." };
    }

    if (cleanEmail !== user.email.toLowerCase()) {
      const emailExists = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });
      if (emailExists && emailExists.id !== userId) {
        return { success: false, error: `L'email ${cleanEmail} è già registrata per un altro socio.` };
      }
    }

    let newMemberNumber: number | null | undefined = undefined;
    if (data.memberNumber !== undefined) {
      if (data.memberNumber === 1) {
        return { success: false, error: "Il numero di tessera 1 è riservato alla memoria del Club e non può essere assegnato." };
      }
      if (data.memberNumber !== null && data.memberNumber !== user.memberNumber) {
        if (data.memberNumber <= 0) {
          return { success: false, error: "Il numero di tessera deve essere maggiore di zero." };
        }
        const numExists = await prisma.user.findUnique({
          where: { memberNumber: data.memberNumber }
        });
        if (numExists && numExists.id !== userId) {
          return { success: false, error: `Il numero di tessera ${data.memberNumber} è già assegnato a ${numExists.name} ${numExists.surname}.` };
        }
      }
      newMemberNumber = data.memberNumber;
    }

    let parsedBirthDate: Date | null | undefined = undefined;
    if (data.birthDate !== undefined) {
      const dateStr = data.birthDate?.trim();
      if (!dateStr) {
        parsedBirthDate = null;
      } else if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year) && day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
            parsedBirthDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
          } else {
            return { success: false, error: "Data di nascita non valida. Usa GG/MM/AAAA (es. 15/04/1985)." };
          }
        } else {
          return { success: false, error: "Data di nascita non valida. Usa GG/MM/AAAA (es. 15/04/1985)." };
        }
      } else if (dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
              parsedBirthDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            }
          } else if (parts[2].length === 4) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
              parsedBirthDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            }
          }
        }
      } else {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          parsedBirthDate = d;
        } else {
          return { success: false, error: "Data di nascita non valida. Usa GG/MM/AAAA (es. 15/04/1985)." };
        }
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        surname,
        email: cleanEmail,
        phone: data.phone?.trim() || null,
        birthPlace: data.birthPlace?.trim() || null,
        gender: data.gender?.trim() || null,
        ...(parsedBirthDate !== undefined && { birthDate: parsedBirthDate }),
        ...(newMemberNumber !== undefined && { memberNumber: newMemberNumber })
      }
    });

    revalidatePath(`/dashboard/admin/soci/${userId}`);
    revalidatePath(`/dashboard/admin/soci`);
    revalidatePath(`/dashboard`);

    return { success: true };
  } catch (error: any) {
    console.error("Errore modifica socio:", error);
    return { success: false, error: "Errore durante il salvataggio dei dati anagrafici." };
  }
}
