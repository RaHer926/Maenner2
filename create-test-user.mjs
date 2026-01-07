import { db } from './database/db.ts';
import { users } from './database/schema.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const email = 'dr.ralf.herwig@gmail.com';
const password = 'test123';
const name = 'Dr. Ralf Herwig';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Check if user exists
const existingUser = await db.select().from(users).where(eq(users.email, email));

if (existingUser.length > 0) {
  // Update password
  await db.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, email));
  console.log(`✅ Password updated for ${email}`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
} else {
  // Create new user
  await db.insert(users).values({
    email,
    name,
    password: hashedPassword,
  });
  console.log(`✅ User created: ${email}`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
}

process.exit(0);
