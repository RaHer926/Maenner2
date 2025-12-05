import postgres from 'postgres';

const connectionString = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ RAILWAY_DATABASE_URL or DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(connectionString);

try {
  console.log('🔄 Connecting to database...');
  
  // Add missing columns to patients table
  console.log('🔄 Adding missing columns to patients table...');
  await sql`
    ALTER TABLE patients 
    ADD COLUMN IF NOT EXISTS patient_number VARCHAR(100) UNIQUE,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL
  `;
  
  // Add missing columns to recommendations table
  console.log('🔄 Fixing recommendations table...');
  await sql`
    ALTER TABLE recommendations 
    ADD COLUMN IF NOT EXISTS min_score INTEGER,
    ADD COLUMN IF NOT EXISTS max_score INTEGER,
    ADD COLUMN IF NOT EXISTS supplements JSONB,
    ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL
  `;
  
  // Create missing indexes
  console.log('🔄 Creating indexes...');
  await sql`CREATE INDEX IF NOT EXISTS patients_patient_number_idx ON patients(patient_number)`;
  await sql`CREATE INDEX IF NOT EXISTS recommendations_section_idx ON recommendations(section)`;
  
  console.log('✅ Schema fixed successfully!');
  
  // Verify tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  
  console.log('\n📊 Database tables:');
  tables.forEach(t => console.log(`  - ${t.table_name}`));
  
} catch (error) {
  console.error('❌ Schema fix failed:', error.message);
  process.exit(1);
} finally {
  await sql.end();
}
