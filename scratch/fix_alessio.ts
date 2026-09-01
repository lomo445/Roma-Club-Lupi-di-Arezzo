import { prisma } from "../src/lib/prisma";

async function main() {
  const user = await prisma.user.findFirst({
    where: { name: "Alessio", surname: "Contemori" },
    include: { subscriptions: true }
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  const sub = user.subscriptions[0];
  if (!sub || sub.status === "ACTIVE") {
    console.log("Subscription not found or already active");
    return;
  }

  // Get max member number
  const maxMember = await prisma.user.aggregate({
    _max: { memberNumber: true }
  });
  const nextMemberNumber = (maxMember._max.memberNumber || 0) + 1;

  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "ACTIVE" }
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { memberNumber: user.memberNumber || nextMemberNumber }
    })
  ]);

  console.log(`Successfully activated subscription for ${user.name} ${user.surname}. Assigned member number: ${user.memberNumber || nextMemberNumber}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
