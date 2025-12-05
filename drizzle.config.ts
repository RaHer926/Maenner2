import type { Config } from 'drizzle-kit';

export default {
  schema: './database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL || '',
  },
} satisfies Config;
