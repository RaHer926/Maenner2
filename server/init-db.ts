import { db, client } from '../database/db.js';
import { sql } from 'drizzle-orm';

export async function initializeDatabase() {
  try {
    console.log('🔄 Checking database schema...');
    
    // Check if survey_recommendations table exists
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'survey_recommendations'
      );
    `);
    
    if (!tableCheck.rows[0]?.exists) {
      console.log('⚠️  survey_recommendations table does not exist. Creating tables...');
      
      // Create all tables using drizzle-kit push
      const { execSync } = await import('child_process');
      execSync('pnpm db:push', { stdio: 'inherit' });
      
      console.log('✅ Database schema initialized');
    } else {
      console.log('✅ Database schema already exists');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Don't throw - allow server to start even if DB init fails
  }
}
