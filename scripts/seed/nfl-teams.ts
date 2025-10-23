import { getDatabase, teams } from '../utils/db';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger';

// NFL Teams data with all 32 teams
const nflTeams = [
    // AFC East
    { externalId: 'BUF', name: 'Bills', city: 'Buffalo', abbreviation: 'BUF', conference: 'AFC', division: 'East', primaryColor: '#00338D', secondaryColor: '#C60C30' },
    { externalId: 'MIA', name: 'Dolphins', city: 'Miami', abbreviation: 'MIA', conference: 'AFC', division: 'East', primaryColor: '#008E97', secondaryColor: '#FC4C02' },
    { externalId: 'NE', name: 'Patriots', city: 'New England', abbreviation: 'NE', conference: 'AFC', division: 'East', primaryColor: '#002244', secondaryColor: '#C60C30' },
    { externalId: 'NYJ', name: 'Jets', city: 'New York', abbreviation: 'NYJ', conference: 'AFC', division: 'East', primaryColor: '#125740', secondaryColor: '#000000' },

    // AFC North
    { externalId: 'BAL', name: 'Ravens', city: 'Baltimore', abbreviation: 'BAL', conference: 'AFC', division: 'North', primaryColor: '#241773', secondaryColor: '#000000' },
    { externalId: 'CIN', name: 'Bengals', city: 'Cincinnati', abbreviation: 'CIN', conference: 'AFC', division: 'North', primaryColor: '#FB4F14', secondaryColor: '#000000' },
    { externalId: 'CLE', name: 'Browns', city: 'Cleveland', abbreviation: 'CLE', conference: 'AFC', division: 'North', primaryColor: '#311D00', secondaryColor: '#FF3C00' },
    { externalId: 'PIT', name: 'Steelers', city: 'Pittsburgh', abbreviation: 'PIT', conference: 'AFC', division: 'North', primaryColor: '#FFB612', secondaryColor: '#000000' },

    // AFC South
    { externalId: 'HOU', name: 'Texans', city: 'Houston', abbreviation: 'HOU', conference: 'AFC', division: 'South', primaryColor: '#03202F', secondaryColor: '#A71930' },
    { externalId: 'IND', name: 'Colts', city: 'Indianapolis', abbreviation: 'IND', conference: 'AFC', division: 'South', primaryColor: '#002C5F', secondaryColor: '#A2AAAD' },
    { externalId: 'JAX', name: 'Jaguars', city: 'Jacksonville', abbreviation: 'JAX', conference: 'AFC', division: 'South', primaryColor: '#006778', secondaryColor: '#9F792C' },
    { externalId: 'TEN', name: 'Titans', city: 'Tennessee', abbreviation: 'TEN', conference: 'AFC', division: 'South', primaryColor: '#0C2340', secondaryColor: '#4B92DB' },

    // AFC West
    { externalId: 'DEN', name: 'Broncos', city: 'Denver', abbreviation: 'DEN', conference: 'AFC', division: 'West', primaryColor: '#FB4F14', secondaryColor: '#002244' },
    { externalId: 'KC', name: 'Chiefs', city: 'Kansas City', abbreviation: 'KC', conference: 'AFC', division: 'West', primaryColor: '#E31837', secondaryColor: '#FFB81C' },
    { externalId: 'LV', name: 'Raiders', city: 'Las Vegas', abbreviation: 'LV', conference: 'AFC', division: 'West', primaryColor: '#000000', secondaryColor: '#A5ACAF' },
    { externalId: 'LAC', name: 'Chargers', city: 'Los Angeles', abbreviation: 'LAC', conference: 'AFC', division: 'West', primaryColor: '#0080C6', secondaryColor: '#FFC20E' },

    // NFC East
    { externalId: 'DAL', name: 'Cowboys', city: 'Dallas', abbreviation: 'DAL', conference: 'NFC', division: 'East', primaryColor: '#003594', secondaryColor: '#869397' },
    { externalId: 'NYG', name: 'Giants', city: 'New York', abbreviation: 'NYG', conference: 'NFC', division: 'East', primaryColor: '#0B2265', secondaryColor: '#A71930' },
    { externalId: 'PHI', name: 'Eagles', city: 'Philadelphia', abbreviation: 'PHI', conference: 'NFC', division: 'East', primaryColor: '#004C54', secondaryColor: '#A5ACAF' },
    { externalId: 'WAS', name: 'Commanders', city: 'Washington', abbreviation: 'WAS', conference: 'NFC', division: 'East', primaryColor: '#5A1414', secondaryColor: '#FFB612' },

    // NFC North
    { externalId: 'CHI', name: 'Bears', city: 'Chicago', abbreviation: 'CHI', conference: 'NFC', division: 'North', primaryColor: '#0B162A', secondaryColor: '#C83803' },
    { externalId: 'DET', name: 'Lions', city: 'Detroit', abbreviation: 'DET', conference: 'NFC', division: 'North', primaryColor: '#0076B6', secondaryColor: '#B0B7BC' },
    { externalId: 'GB', name: 'Packers', city: 'Green Bay', abbreviation: 'GB', conference: 'NFC', division: 'North', primaryColor: '#203731', secondaryColor: '#FFB612' },
    { externalId: 'MIN', name: 'Vikings', city: 'Minnesota', abbreviation: 'MIN', conference: 'NFC', division: 'North', primaryColor: '#4F2683', secondaryColor: '#FFC62F' },

    // NFC South
    { externalId: 'ATL', name: 'Falcons', city: 'Atlanta', abbreviation: 'ATL', conference: 'NFC', division: 'South', primaryColor: '#A71930', secondaryColor: '#000000' },
    { externalId: 'CAR', name: 'Panthers', city: 'Carolina', abbreviation: 'CAR', conference: 'NFC', division: 'South', primaryColor: '#0085CA', secondaryColor: '#101820' },
    { externalId: 'NO', name: 'Saints', city: 'New Orleans', abbreviation: 'NO', conference: 'NFC', division: 'South', primaryColor: '#D3BC8D', secondaryColor: '#000000' },
    { externalId: 'TB', name: 'Buccaneers', city: 'Tampa Bay', abbreviation: 'TB', conference: 'NFC', division: 'South', primaryColor: '#D50A0A', secondaryColor: '#FF7900' },

    // NFC West
    { externalId: 'ARI', name: 'Cardinals', city: 'Arizona', abbreviation: 'ARI', conference: 'NFC', division: 'West', primaryColor: '#97233F', secondaryColor: '#000000' },
    { externalId: 'LAR', name: 'Rams', city: 'Los Angeles', abbreviation: 'LAR', conference: 'NFC', division: 'West', primaryColor: '#003594', secondaryColor: '#FFA300' },
    { externalId: 'SF', name: '49ers', city: 'San Francisco', abbreviation: 'SF', conference: 'NFC', division: 'West', primaryColor: '#AA0000', secondaryColor: '#B3995D' },
    { externalId: 'SEA', name: 'Seahawks', city: 'Seattle', abbreviation: 'SEA', conference: 'NFC', division: 'West', primaryColor: '#002244', secondaryColor: '#69BE28' },
];

export interface SeedOptions {
    force?: boolean;
    dryRun?: boolean;
}

export interface SeedResult {
    success: boolean;
    count: number;
    skipped: boolean;
    message: string;
    teams?: Array<{ name: string; abbreviation: string }>;
}

/**
 * Seed NFL teams into the database
 */
export async function seedNflTeams(options: SeedOptions = {}): Promise<SeedResult> {
    const { force = false, dryRun = false } = options;

    logger.seedStart('nfl');

    try {
        const db = getDatabase();

        // Check if teams already exist
        if (!force) {
            const existingTeams = await db
                .select()
                .from(teams)
                .where(eq(teams.sport, 'nfl'))
                .limit(1);

            if (existingTeams.length > 0) {
                logger.seedSkipped('nfl', 'Teams already exist (use --force to override)');
                return {
                    success: true,
                    count: 0,
                    skipped: true,
                    message: 'NFL teams already exist in database'
                };
            }
        }

        // Prepare teams data
        const teamsToInsert = nflTeams.map(team => ({
            externalId: team.externalId,
            sport: 'nfl',
            name: team.name,
            city: team.city,
            fullName: `${team.city} ${team.name}`,
            abbreviation: team.abbreviation,
            primaryColor: team.primaryColor,
            secondaryColor: team.secondaryColor,
            conference: team.conference,
            division: team.division,
        }));

        if (dryRun) {
            logger.info('Dry run mode - would insert teams:', {
                count: teamsToInsert.length,
                teams: teamsToInsert.map(t => ({ name: t.fullName, abbreviation: t.abbreviation }))
            });

            return {
                success: true,
                count: teamsToInsert.length,
                skipped: false,
                message: `Would seed ${teamsToInsert.length} NFL teams (dry run)`,
                teams: teamsToInsert.map(t => ({ name: t.fullName, abbreviation: t.abbreviation }))
            };
        }

        // Insert teams
        await db.insert(teams).values(teamsToInsert);

        logger.seedComplete('nfl', nflTeams.length);

        // Log teams by division
        logger.debug('Teams by division:');
        const divisions = ['AFC East', 'AFC North', 'AFC South', 'AFC West', 'NFC East', 'NFC North', 'NFC South', 'NFC West'];
        divisions.forEach(div => {
            const divisionTeams = nflTeams.filter(team => `${team.conference} ${team.division}` === div);
            logger.debug(`  ${div}: ${divisionTeams.map(t => t.abbreviation).join(', ')}`);
        });

        return {
            success: true,
            count: nflTeams.length,
            skipped: false,
            message: `Successfully seeded ${nflTeams.length} NFL teams`,
            teams: teamsToInsert.map(t => ({ name: t.fullName, abbreviation: t.abbreviation }))
        };

    } catch (error) {
        logger.seedError('nfl', error);
        return {
            success: false,
            count: 0,
            skipped: false,
            message: `Failed to seed NFL teams: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
