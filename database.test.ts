import { describe, it, expect } from 'vitest';
import postgres from 'postgres';

describe('Database Connection', () => {
  it('should connect to Railway PostgreSQL database', async () => {
    const connectionString = process.env.RAILWAY_DATABASE_URL;
    
    expect(connectionString).toBeDefined();
    expect(connectionString).toContain('postgresql://');
    expect(connectionString).toContain('shortline.proxy.rlwy.net');
    
    const sql = postgres(connectionString!);
    
    try {
      // Test connection
      const result = await sql`SELECT 1 as test`;
      expect(result).toHaveLength(1);
      expect(result[0].test).toBe(1);
      
      // Check if we're connected to PostgreSQL
      const version = await sql`SELECT version()`;
      expect(version[0].version).toContain('PostgreSQL');
      
      console.log('✅ Successfully connected to Railway PostgreSQL');
      console.log('📊 Database version:', version[0].version);
    } finally {
      await sql.end();
    }
  }, 30000);
});
