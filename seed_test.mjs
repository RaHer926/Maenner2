import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function seed() {
  const client = new Client({ connectionString: process.env.RAILWAY_DATABASE_URL });
  await client.connect();
  
  try {
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    // Insert user
    const userResult = await client.query(
      `INSERT INTO users (email, password, name, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       ON CONFLICT (email) DO UPDATE SET password = $2
       RETURNING id, email, name`,
      ['doctor@test.com', hashedPassword, 'Dr. Test User']
    );
    
    console.log('✅ User created/updated:', userResult.rows[0]);
    
    const userId = userResult.rows[0].id;
    
    // Insert patient
    const patientResult = await client.query(
      `INSERT INTO patients (first_name, last_name, date_of_birth, email, phone, patient_number, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (patient_number) DO NOTHING
       RETURNING id, first_name, last_name`,
      ['Max', 'Mustermann', '1980-05-15', 'max@example.com', '+49 123 456789', 'P001', userId]
    );
    
    if (patientResult.rows.length > 0) {
      console.log('✅ Patient created:', patientResult.rows[0]);
    } else {
      console.log('ℹ️  Patient already exists');
    }
    
    console.log('\n🎉 Login credentials:');
    console.log('   Email: doctor@test.com');
    console.log('   Password: test123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

seed();
