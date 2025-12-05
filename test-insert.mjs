import { db, pool } from './database/db.js';
import { patients } from './database/schema.js';

try {
  const result = await db.insert(patients).values({
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1990-01-01',
    email: 'test@test.com',
    phone: '123456',
    patientNumber: 'TEST-001',
  });
  
  console.log('Insert result:', JSON.stringify(result, null, 2));
  await pool.end();
} catch (error) {
  console.error('Error:', error);
  await pool.end();
  process.exit(1);
}
