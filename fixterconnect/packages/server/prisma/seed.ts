import { PrismaClient, UserType } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// SHA-256 hash function matching Workers implementation
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Test Users
  console.log('Creating test users...');

  // Create client test user
  const clientPassword = await hashPassword('password123');
  await prisma.user.upsert({
    where: {
      username: 'testuser'
    },
    update: {
      password: clientPassword
    },
    create: {
      username: 'testuser',
      password: clientPassword,
      type: UserType.CLIENT,
      client: {
        create: {
          firstName: 'Test',
          lastName: 'User',
          email: 'testuser@example.com',
          phone: '555-0100',
          address: '123 Test Street',
          city: 'Denver',
          state: 'CO',
          zip: '80202'
        }
      }
    }
  });

  // Create contractor test user
  const contractorPassword = await hashPassword('contractor123');
  await prisma.user.upsert({
    where: {
      username: 'johnsmith'
    },
    update: {
      password: contractorPassword
    },
    create: {
      username: 'johnsmith',
      password: contractorPassword,
      type: UserType.CONTRACTOR,
      contractor: {
        create: {
          name: 'John Smith',
          rating: 4.8,
          reviewCount: 127,
          description: 'Professional landscaping and lawn care services with over 10 years of experience.',
          yearsInBusiness: 10,
          location: 'Denver, CO',
          googleBusinessUrl: 'https://business.google.com/johnsmith-landscaping'
        }
      }
    }
  });

  console.log('✓ Created 2 test users');

  // Seed Services
  const services = [
    { name: 'Gutter Cleaning', icon: 'home', description: 'Professional gutter cleaning and maintenance services' },
    { name: 'Lawn Mowing', icon: 'scissors', description: 'Regular lawn mowing and trimming services' },
    { name: 'Lawn Aerating', icon: 'tool', description: 'Lawn aeration to improve soil health and grass growth' },
    { name: 'Lawn Fertilizing', icon: 'droplet', description: 'Professional fertilization for healthy, green lawns' },
    { name: 'Landscaping', icon: 'sun', description: 'Complete landscaping design and maintenance' },
    { name: 'Tree Trimming', icon: 'scissors', description: 'Tree pruning and trimming services' },
    { name: 'Snow Removal', icon: 'cloud-snow', description: 'Snow plowing and removal services' },
    { name: 'Pressure Washing', icon: 'droplet', description: 'High-pressure cleaning for driveways, decks, and siding' },
    { name: 'Window Cleaning', icon: 'home', description: 'Interior and exterior window cleaning' },
    { name: 'Deck Staining', icon: 'tool', description: 'Deck cleaning, staining, and sealing services' },
    { name: 'Fence Installation', icon: 'tool', description: 'New fence installation and repair' },
    { name: 'Sprinkler Repair', icon: 'droplet', description: 'Irrigation system repair and maintenance' },
    { name: 'Mulching', icon: 'sun', description: 'Garden and landscape bed mulching' },
    { name: 'Leaf Removal', icon: 'wind', description: 'Fall leaf cleanup and removal services' },
    { name: 'Hedge Trimming', icon: 'scissors', description: 'Shrub and hedge trimming services' }
  ];

  console.log('Creating services...');
  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service
    });
  }
  console.log(`✓ Created ${services.length} services`);

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
