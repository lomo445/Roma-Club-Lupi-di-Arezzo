"use server";

import { prisma } from "@/lib/prisma";
import { sendBrevoEmail, EMAIL_TEMPLATES } from "@/lib/email";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

export async function requestPasswordResetAction(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Per ragioni di sicurezza, restituiamo sempre "success" per evitare enumeration attacks.
      return { success: true }; 
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour da ora

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry }
    });

    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const resetLink = `${protocol}://${host}/reset-password?token=${token}`;
    const loginLink = `${protocol}://${host}/login`;

    await sendBrevoEmail({
      to: [{ email: user.email, name: `${user.name} ${user.surname}` }],
      subject: "Roma Club Arezzo - Recupero Password",
      htmlContent: EMAIL_TEMPLATES.forgotPassword(user.name, resetLink, loginLink)
    });

    return { success: true };
  } catch (error) {
    console.error("Errore reset password:", error);
    return { success: false, error: "Errore interno del server." };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({ where: { resetToken: token } });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return { success: false, error: "Link non valido o scaduto." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Errore salvataggio nuova password:", error);
    return { success: false, error: "Errore interno del server." };
  }
}
