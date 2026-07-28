import { prisma } from "../src/lib/prisma";

async function fix() {
  await prisma.user.update({
    where: { email: 'lvlorita@gmail.com' },
    data: { role: 'USER' }
  });
  console.log("Ruolo aggiornato per Lucia Virginia Lorito a USER.");
}

fix().catch(console.error).finally(() => prisma.$disconnect());
