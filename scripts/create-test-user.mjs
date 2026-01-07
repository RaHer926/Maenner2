import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const connectionString = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No database connection string found');
  process.exit(1);
}

console.log('🔄 Connecting to database...');

const client = postgres(connectionString, { 
  max: 1, 
  connect_timeout: 10,
  ssl: false
});

async function createTestUser() {
  try {
    const email = 'test@example.com';
    const password = 'Test123!';
    const name = 'Dr. Test User';
    const role = 'doctor';
    
    console.log('📝 Creating test user...');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${name}`);
    
    // Check if user already exists
    const existing = await client`
      SELECT id, email FROM users WHERE email = ${email}
    `;
    
    if (existing.length > 0) {
      console.log('⚠️  User already exists, deleting old user...');
      await client`DELETE FROM users WHERE email = ${email}`;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await client`
      INSERT INTO users (email, password, name, role, created_at, updated_at)
      VALUES (${email}, ${hashedPassword}, ${name}, ${role}, NOW(), NOW())
      RETURNING id, email, name, role
    `;
    
    console.log('✅ Test user created successfully!');
    console.log('   ID:', result[0].id);
    console.log('   Email:', result[0].email);
    console.log('   Name:', result[0].name);
    console.log('   Role:', result[0].role);
    
    console.log('\n🔑 Login credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    throw error;
  } finally {
    await client.end();
  }
}

createTestUser();
