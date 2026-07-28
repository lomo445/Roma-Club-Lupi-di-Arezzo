import { prisma } from "../src/lib/prisma";

async function fix() {
  const pendingSubs = await prisma.subscription.findMany({
    where: { status: 'PENDING', method: 'Stripe' },
    include: { user: true }
  });

  console.log("Abbonamenti in PENDING (Stripe):");
  pendingSubs.forEach((s: any) => {
    console.log(`- ${s.id} | ${s.user.name} ${s.user.surname} (${s.user.email}) | Tipo: ${s.type}`);
  });

  if (pendingSubs.length > 0) {
    const ids = pendingSubs.map((s: any) => s.id);
    await prisma.subscription.updateMany({
      where: { id: { in: ids } },
      data: { status: 'ACTIVE' }
    });
    console.log(`Aggiornati ${ids.length} abbonamenti a ACTIVE.`);
  } else {
    console.log("Nessun abbonamento in PENDING via Stripe trovato.");
  }
}

fix().catch(console.error).finally(() => prisma.$disconnect());
