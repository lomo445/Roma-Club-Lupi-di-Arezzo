import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.subscription.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Database svuotato correttamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
