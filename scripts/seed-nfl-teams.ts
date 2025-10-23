// This file is deprecated. Use the new seeding system:
// npm run seed:nfl
// or
// tsx scripts/run-seed.ts --sport nfl

import { seedNflTeams } from './seed/nfl-teams';
import { logger } from './utils/logger';

/**
 * Legacy wrapper for the old seed script
 * @deprecated Use the new seeding system instead
 */
async function legacySeedNflTeams() {
    logger.warn('⚠️ This script is deprecated. Use the new seeding system:');
    logger.info('  npm run seed:nfl');
    logger.info('  or');
    logger.info('  tsx scripts/run-seed.ts --sport nfl');

    logger.info('🏈 Running legacy NFL teams seed...');

    try {
        const result = await seedNflTeams();

        if (result.success) {
            logger.success(`✅ Successfully seeded ${result.count} NFL teams`);
        } else {
            logger.error(`❌ Failed to seed NFL teams: ${result.message}`);
            process.exit(1);
        }
    } catch (error) {
        logger.error('💥 Legacy seed failed:', error);
        process.exit(1);
    }
}

// Run the legacy seed function if this script is executed directly
if (require.main === module) {
    legacySeedNflTeams();
}

export { legacySeedNflTeams };