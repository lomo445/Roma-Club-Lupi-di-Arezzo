import { prisma } from "../src/lib/prisma";

async function main() {
  const pendingSubs = await prisma.subscription.findMany({
    where: { status: "PENDING", method: "Stripe" },
    include: { user: true }
  });

  console.log("Stripe Subscriptions currently PENDING:");
  console.table(pendingSubs.map(s => ({
    id: s.id,
    userId: s.userId,
    userName: `${s.user.name} ${s.user.surname}`,
    price: s.price,
    stripeSessionId: s.stripeSessionId,
    createdAt: s.createdAt
  })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
