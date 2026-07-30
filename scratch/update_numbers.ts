import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Fetching users...");
  const users = await prisma.user.findMany({
    select: { id: true, name: true, surname: true, memberNumber: true }
  });

  console.log("Current Users:");
  console.table(users);

  // We want to map:
  // Lorenzo Monaco -> 7
  // Leonardo Romanazzo -> 2
  // Elpidio Monaco -> 3

  // First pass: nullify target numbers if they exist to avoid unique constraint violations
  console.log("Temporarily freeing target numbers if occupied...");
  for (const u of users) {
    if (u.memberNumber === 7 || u.memberNumber === 2 || u.memberNumber === 3) {
       await prisma.user.update({ where: { id: u.id }, data: { memberNumber: null } });
    }
  }

  for (const u of users) {
    const fullName = `${u.name} ${u.surname}`.toLowerCase().trim();
    if (fullName === "lorenzo monaco") {
      console.log(`Updating Lorenzo Monaco to 7...`);
      await prisma.user.update({ where: { id: u.id }, data: { memberNumber: 7 } });
    } else if (fullName === "leonardo romanazzo") {
      console.log(`Updating Leonardo Romanazzo to 2...`);
      await prisma.user.update({ where: { id: u.id }, data: { memberNumber: 2 } });
    } else if (fullName === "elpidio monaco") {
      console.log(`Updating Elpidio Monaco to 3...`);
      await prisma.user.update({ where: { id: u.id }, data: { memberNumber: 3 } });
    }
  }

  // To leave 1 empty, we don't assign it to anyone. The next assignment logic is MAX(memberNumber) + 1, so if someone already has 7, the next will be 8. Number 1 will remain empty.
  
  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
