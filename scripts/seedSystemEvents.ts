import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding system events...");

  // Evento per recuperare presenze passate
  await prisma.event.create({
    data: {
      title: "Presenze Precedenti Non Registrate",
      type: "SYSTEM",
      date: new Date()
    }
  });

  // Evento per riunioni o altri eventi
  await prisma.event.create({
    data: {
      title: "Altri Eventi (Riunioni, Cene, ecc.)",
      type: "OTHER",
      date: new Date()
    }
  });

  console.log("System events creati con successo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
