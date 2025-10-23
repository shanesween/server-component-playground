import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create the database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

// Export schema and types
export * from './schema';
export type { DrizzleTransaction } from './types';

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    await sql`SELECT 1`;
    return { connected: true, error: null };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}