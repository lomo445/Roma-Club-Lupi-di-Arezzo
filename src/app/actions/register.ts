"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUserAction(data: any) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const names = data.nomeCognome.split(" ");
    const name = names[0];
    const surname = names.slice(1).join(" ") || "";
    
    let birthDate = null;
    if (data.dataNascita) {
      birthDate = new Date(data.dataNascita);
    }

    let role = "USER";
    if (data.isDirettivo && data.chiaveSegreta === "LUPI26") {
      role = "ADMIN";
    }

    const maxMember = await prisma.user.aggregate({
      _max: { memberNumber: true }
    });
    
    let nextMemberNumber = 2;
    if (maxMember._max.memberNumber && maxMember._max.memberNumber >= 1) {
      nextMemberNumber = maxMember._max.memberNumber + 1;
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: name,
        surname: surname,
        phone: data.telefono,
        birthPlace: data.luogoNascita,
        birthDate: birthDate,
        gender: data.sesso,
        role: role as "USER" | "ADMIN",
        memberNumber: nextMemberNumber
      }
    });

    const priceMap = {
      "Adulto": 65,
      "Ridotto": 35,
      "Familiare": 35
    };

    await prisma.subscription.create({
      data: {
        userId: user.id,
        season: "2026/2027",
        type: data.tipoTessera,
        price: priceMap[data.tipoTessera as keyof typeof priceMap] || 65,
        method: data.metodoPagamento,
        status: "ACTIVE" 
      }
    });

    return { success: true };
  } catch (e: any) {
    console.error("Registrazione fallita:", e);
    if (e.code === 'P2002') {
        return { success: false, error: "Questa email è già registrata." };
    }
    return { success: false, error: "Errore interno durante la registrazione." };
  }
}
