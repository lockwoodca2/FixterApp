import bcrypt from 'bcrypt';
import db from './database.js';
import { initializeDatabase } from './database.js';

async function seed() {
  console.log('Starting database seed...');

  // Initialize database first
  initializeDatabase();

  try {
    // Hash passwords
    const clientPassword = await bcrypt.hash('client123', 10);
    const contractorPassword = await bcrypt.hash('contractor123', 10);

    // Create test client
    const clientId = db.createUser('testclient', clientPassword, 'client');
    db.createClient({
      id: clientId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-0100'
    });
    console.log('✓ Created test client (username: testclient, password: client123)');

    // Create test contractor
    const contractorId = db.createUser('testcontractor', contractorPassword, 'contractor');
    db.createContractor({
      id: contractorId,
      name: 'Bob Builder',
      rating: 4.8,
      review_count: 127,
      description: 'Professional contractor with 15 years of experience',
      years_in_business: 15,
      location: 'San Francisco, CA'
    });
    console.log('✓ Created test contractor (username: testcontractor, password: contractor123)');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Test Accounts:');
    console.log('  Client: testclient / client123');
    console.log('  Contractor: testcontractor / contractor123\n');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
