import bcrypt from 'bcrypt';
import db from './database.js';

export async function seedInitialData() {
  try {
    // Check if users already exist
    const existingClient = db.findUserByUsername('testclient', 'client');
    const existingContractor = db.findUserByUsername('testcontractor', 'contractor');

    if (existingClient && existingContractor) {
      console.log('Test accounts already exist, skipping seed');
      return;
    }

    console.log('Seeding initial data...');

    // Hash passwords
    const clientPassword = await bcrypt.hash('client123', 10);
    const contractorPassword = await bcrypt.hash('contractor123', 10);

    // Create test client if doesn't exist
    if (!existingClient) {
      const clientId = db.createUser('testclient', clientPassword, 'client');
      db.createClient({
        id: clientId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-0100'
      });
      console.log('✓ Created test client (username: testclient, password: client123)');
    }

    // Create test contractor if doesn't exist
    if (!existingContractor) {
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
    }

    console.log('Initial data seeded successfully!\n');
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}
