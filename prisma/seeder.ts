import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';
import { cleanupDb } from './cleanup-db';

async function seed() {
  const prisma = await cleanupDb();

  // create a new user
  const testeUser = await prisma.user.create({
    data: {
      name: 'User Teste',
      email: 'teste@email.com',
      password: await argon2.hash('123456'),
    },
    select: {
      id: true,
    },
  });

  await prisma.expense.createMany({
    data: Array.from({ length: 100 }, () => ({
      title: faker.lorem.word(),
      amount: faker.number.int({ min: 1, max: 10000 }),
      date: faker.date.between({ from: '2025-01-01', to: '2026-01-01' }),
      category: faker.helpers.arrayElement(['food', 'transport', 'health', 'education', 'entertainment', 'other']),
      userId: testeUser.id,
    })),
  });

  console.log('Successfully seeded database.');
}
seed();
