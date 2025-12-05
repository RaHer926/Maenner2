import postgres from 'postgres';
import { readFileSync } from 'fs';

const connectionString = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ RAILWAY_DATABASE_URL or DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(connectionString);

try {
  console.log('🔄 Connecting to database...');
  
  const sqlScript = readFileSync('./create-tables.sql', 'utf-8');
  
  console.log('🔄 Executing SQL migration...');
  await sql.unsafe(sqlScript);
  
  console.log('✅ Database tables created successfully!');
  
  // Verify tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  
  console.log('\n📊 Created tables:');
  tables.forEach(t => console.log(`  - ${t.table_name}`));
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
} finally {
  await sql.end();
}
