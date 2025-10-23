import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { loadEnvironment } from './env';
import { logger } from './logger';
import * as schema from '../../src/lib/db/schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;

/**
 * Get database connection instance
 * Creates connection if it doesn't exist
 */
export function getDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    try {
        const env = loadEnvironment();

        if (!env.DATABASE_URL) {
            throw new Error('DATABASE_URL is required but not found in environment');
        }

        logger.debug('Connecting to database...', {
            url: env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@') // Hide credentials in logs
        });

        const sql = neon(env.DATABASE_URL);
        dbInstance = drizzle(sql, { schema });

        logger.success('Database connection established');
        return dbInstance;
    } catch (error) {
        logger.error('Failed to connect to database:', error);
        throw error;
    }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
        const db = getDatabase();
        await db.execute('SELECT 1');
        logger.success('Database connection test passed');
        return { connected: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Database connection test failed:', errorMessage);
        return { connected: false, error: errorMessage };
    }
}

/**
 * Close database connection
 */
export async function closeConnection(): Promise<void> {
    if (dbInstance) {
        logger.debug('Closing database connection...');
        dbInstance = null;
        logger.success('Database connection closed');
    }
}

/**
 * Execute a transaction with proper error handling
 */
export async function withTransaction<T>(
    callback: (db: ReturnType<typeof drizzle>) => Promise<T>
): Promise<T> {
    const db = getDatabase();

    try {
        logger.debug('Starting database transaction...');
        const result = await db.transaction(callback);
        logger.success('Database transaction completed');
        return result;
    } catch (error) {
        logger.error('Database transaction failed:', error);
        throw error;
    }
}

// Export schema and types for convenience
export * from '../../src/lib/db/schema';
export type { DrizzleTransaction } from '../../src/lib/db/types';
