#!/usr/bin/env tsx

import { testConnection, closeConnection } from './utils/db';
import { logger } from './utils/logger';
import { seedAll, seedSport, checkSeed, Sport } from './seed';

interface CliOptions {
    sport?: Sport;
    force: boolean;
    dryRun: boolean;
    check: boolean;
    help: boolean;
    verbose: boolean;
}

/**
 * Parse command line arguments
 */
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
            case '--dry-run':
            case '-d':
                options.dryRun = true;
                break;
            case '--check':
            case '-c':
                options.check = true;
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--sport':
            case '-s':
                const sport = args[i + 1];
                if (sport && ['nfl', 'mlb', 'nba', 'nhl'].includes(sport)) {
                    options.sport = sport as Sport;
                    i++; // Skip next argument
                } else {
                    logger.error('Invalid sport. Must be one of: nfl, mlb, nba, nhl');
                    process.exit(1);
                }
                break;
            default:
                if (!arg.startsWith('-')) {
                    // Treat as sport if it's not a flag
                    if (['nfl', 'mlb', 'nba', 'nhl'].includes(arg)) {
                        options.sport = arg as Sport;
                    } else {
                        logger.error(`Unknown argument: ${arg}`);
                        process.exit(1);
                    }
                }
                break;
        }
    }

    return options;
}

/**
 * Show help information
 */
function showHelp(): void {
    console.log(`
🏈 Sports Database Seeder

USAGE:
  npm run seed [options]
  tsx scripts/run-seed.ts [options]

OPTIONS:
  -h, --help          Show this help message
  -s, --sport <sport> Seed specific sport (nfl, mlb, nba, nhl)
  -f, --force         Force seed even if data exists
  -d, --dry-run       Show what would be seeded without doing it
  -c, --check         Check what would be seeded
  -v, --verbose       Enable verbose logging

EXAMPLES:
  npm run seed                    # Seed all sports
  npm run seed --sport nfl        # Seed only NFL teams
  npm run seed --dry-run         # Show what would be seeded
  npm run seed --force           # Force seed even if data exists
  npm run seed --check nfl       # Check NFL teams without seeding

SPORTS:
  nfl    National Football League (32 teams)
  mlb    Major League Baseball (coming soon)
  nba    National Basketball Association (coming soon)
  nhl    National Hockey League (coming soon)
`);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
    const options = parseArgs();

    if (options.help) {
        showHelp();
        return;
    }

    try {
        // Test database connection first
        logger.info('🔍 Testing database connection...');
        const connectionTest = await testConnection();

        if (!connectionTest.connected) {
            logger.error('❌ Database connection failed:', connectionTest.error);
            process.exit(1);
        }

        // Handle check mode
        if (options.check) {
            logger.info('🔍 Checking what would be seeded...');
            const result = options.sport
                ? await checkSeed(options.sport)
                : await checkSeed();

            if (result.success) {
                logger.success('✅ Check completed successfully');
            } else {
                logger.error('❌ Check failed');
                process.exit(1);
            }
            return;
        }

        // Execute seeding
        const seedOptions = {
            force: options.force,
            dryRun: options.dryRun
        };

        let result;

        if (options.sport) {
            logger.info(`🏈 Seeding ${options.sport.toUpperCase()} teams...`);
            result = await seedSport(options.sport, seedOptions);
        } else {
            logger.info('🏈 Seeding all sports...');
            result = await seedAll(seedOptions);
        }

        // Handle results
        if (result.success) {
            logger.success('🎉 Seeding completed successfully!');

            if ('totalCount' in result) {
                logger.info(`📊 Total teams seeded: ${result.totalCount}`);
            } else {
                logger.info(`📊 Teams seeded: ${result.count}`);
            }
        } else {
            logger.error('❌ Seeding failed');

            if ('errors' in result && result.errors.length > 0) {
                result.errors.forEach(error => logger.error(`  - ${error}`));
            }

            process.exit(1);
        }

    } catch (error) {
        logger.error('💥 Unexpected error:', error);
        process.exit(1);
    } finally {
        // Close database connection
        await closeConnection();
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the main function
if (require.main === module) {
    main().catch((error) => {
        logger.error('💥 Main function failed:', error);
        process.exit(1);
    });
}
