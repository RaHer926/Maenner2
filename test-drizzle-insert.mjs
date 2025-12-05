import { db, pool } from './database/db.js';
import { patients } from './database/schema.js';

try {
  console.log('Testing insert...');
  const result = await db.insert(patients).values({
    firstName: 'Drizzle',
    lastName: 'Test',
    dateOfBirth: '1995-05-15',
    email: 'drizzle@test.com',
    phone: '999999',
    patientNumber: 'DRZ-001',
  });
  
  console.log('Insert result:', result);
  console.log('Insert result type:', typeof result);
  console.log('Insert result keys:', Object.keys(result));
  console.log('Insert result[0]:', result[0]);
  
  await pool.end();
  process.exit(0);
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  await pool.end();
  process.exit(1);
}
