'use client';

import { useState } from 'react';

export default function StandaloneScriptsLearning() {
    const [scriptOutput, setScriptOutput] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);

    const runSeedCheck = async () => {
        setIsRunning(true);
        setScriptOutput('Running seed check...\n');

        try {
            const response = await fetch('/api/seed/nfl-teams', {
                method: 'GET'
            });
            const data = await response.json();
            setScriptOutput(prev => prev + `✅ Found ${data.count} NFL teams in database\n`);
        } catch (error) {
            setScriptOutput(prev => prev + `❌ Error: ${error}\n`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    🛠️ Standalone Scripts & CLI Architecture
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Learn how to build standalone scripts that work without the Next.js server, perfect for seeding, migrations, and automation.
                </p>
            </div>

            {/* Architecture Overview */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🏗️ Standalone Script Architecture
                </h2>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg mb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-200">
                                Environment Management
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• <strong>Multi-file loading</strong> - .env, .env.local, .env.production</li>
                                <li>• <strong>Variable validation</strong> - Required vs optional env vars</li>
                                <li>• <strong>Priority order</strong> - process.env → .env files</li>
                                <li>• <strong>Type safety</strong> - TypeScript interfaces for env config</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
                                Database Connection
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• <strong>Direct connection</strong> - No Next.js server required</li>
                                <li>• <strong>Connection pooling</strong> - Optimized for serverless</li>
                                <li>• <strong>Error handling</strong> - Graceful failure and retry logic</li>
                                <li>• <strong>Type safety</strong> - Drizzle ORM with full TypeScript support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CLI Interface */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    💻 CLI Interface Design
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200">
                        Command Line Arguments
                    </h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                        {`// Argument parsing with help system
function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    force: false,
    dryRun: false,
    check: false,
    help: false,
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--force':
      case '-f':
        options.force = true;
        break;
      // ... more options
    }
  }
  return options;
}`}
                    </pre>
                </div>
            </section>

            {/* NPM Scripts Integration */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    📦 NPM Scripts Integration
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-orange-800 dark:text-orange-200">
                            Package.json Scripts
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                            {`"scripts": {
  "seed": "tsx scripts/run-seed.ts",
  "seed:nfl": "tsx scripts/run-seed.ts --sport nfl",
  "seed:all": "tsx scripts/run-seed.ts",
  "seed:check": "tsx scripts/run-seed.ts --check",
  "seed:dry-run": "tsx scripts/run-seed.ts --dry-run",
  "seed:force": "tsx scripts/run-seed.ts --force"
}`}
                        </pre>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                            Usage Examples
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <code>npm run seed</code> - Seed all sports
                            </div>
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <code>npm run seed:nfl</code> - NFL teams only
                            </div>
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <code>npm run seed:dry-run</code> - Preview changes
                            </div>
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                <code>npm run seed:force</code> - Override existing
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modular Architecture */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🧩 Modular Architecture
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-800 dark:text-indigo-200">
                        Project Structure
                    </h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                        {`scripts/
├── utils/
│   ├── env.ts          # Environment loading
│   ├── db.ts           # Database connection
│   └── logger.ts       # Logging utilities
├── seed/
│   ├── nfl-teams.ts    # NFL teams seeding
│   └── index.ts        # Seed coordination
└── run-seed.ts         # Main CLI interface`}
                    </pre>
                </div>
            </section>

            {/* Live Demo */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🎮 Live Demo
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Test Database Seeding</h3>
                        <button
                            onClick={runSeedCheck}
                            disabled={isRunning}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isRunning ? 'Running...' : 'Check Database'}
                        </button>
                    </div>

                    {scriptOutput && (
                        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                            <pre className="text-sm whitespace-pre-wrap">{scriptOutput}</pre>
                        </div>
                    )}
                </div>
            </section>

            {/* Key Benefits */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🎯 Key Benefits
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                            Development Benefits
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>No server required</strong> - Direct database access</li>
                            <li>• <strong>Environment agnostic</strong> - Works anywhere</li>
                            <li>• <strong>Developer friendly</strong> - Simple npm commands</li>
                            <li>• <strong>Type safe</strong> - Full TypeScript support</li>
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                            Production Benefits
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>CI/CD ready</strong> - Automation friendly</li>
                            <li>• <strong>Error handling</strong> - Proper exit codes</li>
                            <li>• <strong>Logging</strong> - Structured logging system</li>
                            <li>• <strong>Extensible</strong> - Easy to add new features</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Code Examples */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    💻 Code Examples
                </h2>

                <div className="space-y-6">
                    {/* Environment Loading */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                            Environment Loading Utility
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                            {`export function loadEnvironment(): EnvConfig {
  const envFiles = ['.env.local', '.env.production', '.env'];
  const envVars: Record<string, string> = {};

  // Load from process.env first (highest priority)
  Object.assign(envVars, process.env);

  // Load from .env files (in order of priority)
  for (const envFile of envFiles) {
    try {
      const envPath = join(process.cwd(), envFile);
      const envContent = readFileSync(envPath, 'utf8');
      
      envContent.split('\\n').forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
            if (!envVars[key.trim()]) {
              envVars[key.trim()] = value;
            }
          }
        }
      });
    } catch (error) {
      // File doesn't exist, continue
    }
  }

  return envVars as EnvConfig;
}`}
                        </pre>
                    </div>

                    {/* Database Connection */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200">
                            Standalone Database Connection
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                            {`export function getDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const env = loadEnvironment();
    
    if (!env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required but not found');
    }

    const sql = neon(env.DATABASE_URL);
    dbInstance = drizzle(sql, { schema });

    logger.success('Database connection established');
    return dbInstance;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}`}
                        </pre>
                    </div>
                </div>
            </section>
        </div>
    );
}
