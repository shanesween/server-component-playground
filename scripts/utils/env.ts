import { readFileSync } from 'fs';
import { join } from 'path';

interface EnvConfig {
    DATABASE_URL: string;
    NEXTAUTH_SECRET?: string;
    JWT_SECRET?: string;
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
    TWILIO_PHONE_NUMBER?: string;
}

/**
 * Load environment variables from .env files
 * Supports .env, .env.local, and .env.production
 */
export function loadEnvironment(): EnvConfig {
    const envFiles = ['.env.local', '.env.production', '.env'];
    const envVars: Record<string, string> = {};

    // Load from process.env first (highest priority)
    Object.assign(envVars, process.env);

    // Load from .env files (in order of priority)
    for (const envFile of envFiles) {
        try {
            const envPath = join(process.cwd(), envFile);
            const envContent = readFileSync(envPath, 'utf8');

            envContent.split('\n').forEach(line => {
                if (line.trim() && !line.startsWith('#')) {
                    const [key, ...valueParts] = line.split('=');
                    if (key && valueParts.length > 0) {
                        const value = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
                        if (!envVars[key.trim()]) { // Don't override existing values
                            envVars[key.trim()] = value;
                        }
                    }
                }
            });
        } catch (error) {
            // File doesn't exist, continue
        }
    }

    // Validate required environment variables
    const requiredVars = ['DATABASE_URL'];
    const missingVars = requiredVars.filter(varName => !envVars[varName]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}\n` +
            'Please ensure your .env file contains DATABASE_URL'
        );
    }

    return envVars as EnvConfig;
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback?: string): string {
    const value = process.env[key];
    if (value) return value;
    if (fallback) return fallback;
    throw new Error(`Environment variable ${key} is required`);
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}
