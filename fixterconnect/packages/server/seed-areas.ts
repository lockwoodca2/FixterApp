import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const areas = [
    { name: 'Nampa', state: 'ID' },
    { name: 'Caldwell', state: 'ID' },
    { name: 'Meridian', state: 'ID' },
    { name: 'Kuna', state: 'ID' },
    { name: 'Boise', state: 'ID' },
    { name: 'Eagle', state: 'ID' },
    { name: 'Star', state: 'ID' }
  ];

  for (const area of areas) {
    await prisma.serviceArea.upsert({
      where: { name: area.name },
      update: {},
      create: area
    });
    console.log(`✓ Created/verified service area: ${area.name}, ${area.state}`);
  }

  console.log('\n✅ Service areas seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding service areas:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
