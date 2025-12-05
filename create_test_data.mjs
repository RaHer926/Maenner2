import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { users, patients } from './database/schema.js';

dotenv.config();

const client = postgres(process.env.RAILWAY_DATABASE_URL);
const db = drizzle(client);

async function createTestData() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    // Create test user
    const [user] = await db.insert(users).values({
      email: 'doctor@test.com',
      password: hashedPassword,
      name: 'Dr. Test User',
    }).onConflictDoNothing().returning();
    
    console.log('User created:', user);
    
    // Get user ID (in case it already exists)
    const existingUser = await db.select().from(users).where(users.email.eq('doctor@test.com')).limit(1);
    const userId = user?.id || existingUser[0]?.id;
    
    if (userId) {
      // Create test patient
      const [patient] = await db.insert(patients).values({
        firstName: 'Max',
        lastName: 'Mustermann',
        dateOfBirth: '1980-05-15',
        email: 'max@example.com',
        phone: '+49 123 456789',
        patientNumber: 'P001',
        createdBy: userId,
      }).onConflictDoNothing().returning();
      
      console.log('Patient created:', patient);
    }
    
    console.log('\n✅ Test data created successfully!');
    console.log('Login credentials:');
    console.log('Email: doctor@test.com');
    console.log('Password: test123');
    
    await client.end();
  } catch (error) {
    console.error('Error:', error);
    await client.end();
    process.exit(1);
  }
}

createTestData();
