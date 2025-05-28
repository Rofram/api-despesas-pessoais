import { PrismaClient } from '@prisma/client';

export async function cleanupDb() {
  const prisma = new PrismaClient();
  // cleanup the existing database
  await prisma.$transaction([
    prisma.expense.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('Database cleaned');

  return prisma;
}

process.argv[2] === 'cleanup' && cleanupDb();
