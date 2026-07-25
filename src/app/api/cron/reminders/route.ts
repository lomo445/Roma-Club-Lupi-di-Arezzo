import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBrevoEmail, EMAIL_TEMPLATES } from "@/lib/email";

export async function GET(req: Request) {
  // Verifica authorization header di Vercel Cron per sicurezza
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Cerca abbonamenti in PENDING da più di 24 ore e che non hanno ancora ricevuto il sollecito
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const pendingSubs = await prisma.subscription.findMany({
      where: {
        status: "PENDING",
        reminderSent: false,
        createdAt: {
          lte: yesterday
        }
      },
      include: { user: true }
    });

    let sentCount = 0;

    for (const sub of pendingSubs) {
      const res = await sendBrevoEmail({
        to: [{ email: sub.user.email, name: `${sub.user.name} ${sub.user.surname}` }],
        subject: "Roma Club Arezzo - Completa la tua iscrizione",
        htmlContent: EMAIL_TEMPLATES.reminder(sub.user.name, sub.price)
      });

      if (res.success) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { reminderSent: true }
        });
        sentCount++;
      }
    }

    return NextResponse.json({ success: true, emailsSent: sentCount });

  } catch (err: any) {
    console.error("Cron Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
