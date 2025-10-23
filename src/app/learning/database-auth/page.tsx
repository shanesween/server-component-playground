'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/use-session';
import { checkDatabaseConnection } from '@/lib/db';

export default function DatabaseAuthLearning() {
    const { user, isAuthenticated, isLoading } = useSession();
    const [dbStatus, setDbStatus] = useState<{ connected: boolean; error: string | null } | null>(null);
    const [isTestingConnection, setIsTestingConnection] = useState(false);

    const testDatabaseConnection = async () => {
        setIsTestingConnection(true);
        try {
            const response = await fetch('/api/test-db');
            const result = await response.json();
            setDbStatus(result);
        } catch (error) {
            setDbStatus({ connected: false, error: 'Failed to test connection' });
        } finally {
            setIsTestingConnection(false);
        }
    };

    useEffect(() => {
        testDatabaseConnection();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    📱 Phone Number Authentication System
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Learn how we built a seamless phone number authentication system with SMS verification and user onboarding.
                </p>
            </div>

            {/* Architecture Overview */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🏗️ Architecture Overview
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
                                Database Layer
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• <strong>Neon DB</strong> - Serverless PostgreSQL</li>
                                <li>• <strong>Drizzle ORM</strong> - Type-safe database queries</li>
                                <li>• <strong>Schema Migrations</strong> - Version-controlled database changes</li>
                                <li>• <strong>Connection Pooling</strong> - Optimized for serverless</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-200">
                                Phone Authentication Layer
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• <strong>SMS Magic Codes</strong> - 6-digit verification codes</li>
                                <li>• <strong>Phone Number Formatting</strong> - E.164 international format</li>
                                <li>• <strong>Rate Limiting</strong> - Prevent SMS spam and abuse</li>
                                <li>• <strong>Onboarding Wizard</strong> - First-time user experience</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Database Connection Test */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🔌 Database Connection
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Neon Database Status</h3>
                        <button
                            onClick={testDatabaseConnection}
                            disabled={isTestingConnection}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isTestingConnection ? 'Testing...' : 'Test Connection'}
                        </button>
                    </div>

                    {dbStatus && (
                        <div className={`p-4 rounded-lg ${dbStatus.connected
                            ? 'bg-green-50 border border-green-200 dark:bg-green-900/20'
                            : 'bg-red-50 border border-red-200 dark:bg-red-900/20'
                            }`}>
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-3 ${dbStatus.connected ? 'bg-green-500' : 'bg-red-500'
                                    }`}></span>
                                <span className="font-medium">
                                    {dbStatus.connected ? 'Connected to Neon Database' : 'Connection Failed'}
                                </span>
                            </div>
                            {dbStatus.error && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                    Error: {dbStatus.error}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Authentication Status */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🔐 Authentication Status
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    {isLoading ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                            <span>Checking authentication...</span>
                        </div>
                    ) : isAuthenticated ? (
                        <div className="bg-green-50 border border-green-200 dark:bg-green-900/20 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                                <span className="font-medium">Authenticated</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Welcome, {user?.name || user?.phoneNumber}! You're signed in via phone number authentication.
                            </p>
                            {user?.phoneNumber && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    Phone: {user.phoneNumber}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></span>
                                <span className="font-medium">Not Authenticated</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Sign in to see your authentication details.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Database Schema */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    📊 Database Schema
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                            User Tables
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                                <div className="font-medium text-sm">users</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    id, phoneNumber, phoneVerified, firstName, lastName, onboardingCompleted
                                </div>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                                <div className="font-medium text-sm">accounts</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    OAuth provider accounts (Google, etc.)
                                </div>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                                <div className="font-medium text-sm">sessions</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    NextAuth session management
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                <div className="font-medium text-sm">sms_verification_codes</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    SMS magic codes with rate limiting
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                            Application Tables
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                                <div className="font-medium text-sm">teams</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Sports teams data (NFL, MLB, etc.)
                                </div>
                            </div>
                            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded">
                                <div className="font-medium text-sm">user_preferences</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    User settings and notifications
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                                <div className="font-medium text-sm">games_cache</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Live game scores and data
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Examples */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    💻 Code Examples
                </h2>

                <div className="space-y-6">
                    {/* Database Connection */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                            Database Connection (Drizzle + Neon)
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                            {`import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });`}
                        </pre>
                    </div>

                    {/* Phone Authentication */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200">
                            Phone Number Verification
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                            {`// Send SMS verification code
export async function sendCode(phoneNumber: string) {
  const code = generateCode(); // 6-digit code
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  
  await db.insert(smsVerificationCodes).values({
    phoneNumber: formatPhoneNumber(phoneNumber),
    code,
    expiresAt,
  });
  
  // Send SMS via Twilio/AWS SNS
  await sendSMS(phoneNumber, code);
}`}
                        </pre>
                    </div>

                    {/* User Creation */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                            Phone-First User Creation
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                            {`const [newUser] = await db
  .insert(users)
  .values({
    phoneNumber: formatPhoneNumber(phoneNumber),
    phoneVerified: true,
    onboardingCompleted: false,
  })
  .returning({
    id: users.id,
    phoneNumber: users.phoneNumber,
    onboardingCompleted: users.onboardingCompleted,
  });`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Migration Management */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🚀 Migration Management
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4 text-orange-800 dark:text-orange-200">
                        Database Migrations Created
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="font-mono text-sm">0000_conscious_gravity.sql</span>
                            <span className="text-xs text-gray-500">Initial schema</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="font-mono text-sm">0001_glorious_spyke.sql</span>
                            <span className="text-xs text-gray-500">OAuth tables</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="font-mono text-sm">0002_fresh_stepford_cuckoos.sql</span>
                            <span className="text-xs text-gray-500">NextAuth compatibility</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="font-mono text-sm">0003_sloppy_living_lightning.sql</span>
                            <span className="text-xs text-gray-500">Foreign key updates</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="font-mono text-sm">0006_lush_tag.sql</span>
                            <span className="text-xs text-gray-500">Phone authentication schema</span>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Commands:</strong> <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">npm run db:generate</code> to create migrations,
                            <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded ml-1">npm run db:push</code> to apply to database
                        </p>
                    </div>
                </div>
            </section>

            {/* Key Learnings */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🎯 Key Learnings
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                            Database Architecture
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>Serverless PostgreSQL</strong> with Neon for scalability</li>
                            <li>• <strong>Type-safe queries</strong> with Drizzle ORM</li>
                            <li>• <strong>Migration management</strong> for schema evolution</li>
                            <li>• <strong>Connection pooling</strong> for optimal performance</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200">
                            Phone Authentication Patterns
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>SMS magic codes</strong> - No passwords required</li>
                            <li>• <strong>Phone number formatting</strong> - E.164 international standard</li>
                            <li>• <strong>Rate limiting</strong> - Prevent SMS abuse and spam</li>
                            <li>• <strong>Onboarding flow</strong> - Seamless first-time user experience</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Next Steps */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🚀 Next Steps
                </h2>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                        Ready for Production
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                            <h4 className="font-semibold mb-2">📱 SMS Integration</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Integrate Twilio or AWS SNS for production SMS delivery
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                            <h4 className="font-semibold mb-2">🔐 Security Hardening</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Implement SMS rate limiting, code expiration, and abuse prevention
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                            <h4 className="font-semibold mb-2">📊 Monitoring</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Add SMS delivery monitoring and phone auth analytics
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                            <h4 className="font-semibold mb-2">🧪 Testing</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Implement phone auth flow testing and SMS mock services
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
