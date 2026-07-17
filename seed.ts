import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lupidarezzo.it' },
    update: {},
    create: {
      name: 'Admin',
      surname: 'Direttivo',
      email: 'admin@lupidarezzo.it',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'socio@lupidarezzo.it' },
    update: {},
    create: {
      name: 'Mario',
      surname: 'Rossi',
      email: 'socio@lupidarezzo.it',
      password: await bcrypt.hash('socio', 10),
      memberNumber: 1234,
      role: 'USER',
    },
  });

  console.log({ adminUser, normalUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
