import { seedNflTeams, SeedOptions, SeedResult } from './nfl-teams';
import { logger } from '../utils/logger';

export type Sport = 'nfl' | 'mlb' | 'nba' | 'nhl';

export interface SeedAllResult {
    success: boolean;
    totalCount: number;
    results: Record<string, SeedResult>;
    errors: string[];
}

/**
 * Seed all available sports
 */
export async function seedAll(options: SeedOptions = {}): Promise<SeedAllResult> {
    const results: Record<string, SeedResult> = {};
    const errors: string[] = [];
    let totalCount = 0;
    let allSuccess = true;

    logger.info('🏈 Starting full database seed...');

    // Seed NFL teams
    try {
        const nflResult = await seedNflTeams(options);
        results.nfl = nflResult;
        totalCount += nflResult.count;

        if (!nflResult.success) {
            allSuccess = false;
            errors.push(`NFL: ${nflResult.message}`);
        }
    } catch (error) {
        allSuccess = false;
        const errorMessage = `NFL: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMessage);
        results.nfl = {
            success: false,
            count: 0,
            skipped: false,
            message: errorMessage
        };
    }

    // TODO: Add other sports here
    // const mlbResult = await seedMlbTeams(options);
    // const nbaResult = await seedNbaTeams(options);
    // const nhlResult = await seedNhlTeams(options);

    if (allSuccess) {
        logger.success(`🎉 Successfully seeded ${totalCount} teams across all sports`);
    } else {
        logger.warn(`⚠️ Completed with ${errors.length} errors`);
    }

    return {
        success: allSuccess,
        totalCount,
        results,
        errors
    };
}

/**
 * Seed a specific sport
 */
export async function seedSport(sport: Sport, options: SeedOptions = {}): Promise<SeedResult> {
    switch (sport) {
        case 'nfl':
            return await seedNflTeams(options);
        case 'mlb':
            throw new Error('MLB seeding not yet implemented');
        case 'nba':
            throw new Error('NBA seeding not yet implemented');
        case 'nhl':
            throw new Error('NHL seeding not yet implemented');
        default:
            throw new Error(`Unknown sport: ${sport}`);
    }
}

/**
 * Check what would be seeded without actually seeding
 */
export async function checkSeed(sport?: Sport): Promise<SeedResult | SeedAllResult> {
    const options = { dryRun: true };

    if (sport) {
        return await seedSport(sport, options);
    } else {
        return await seedAll(options);
    }
}

// Re-export everything for convenience
export { seedNflTeams } from './nfl-teams';
export type { SeedOptions, SeedResult } from './nfl-teams';
