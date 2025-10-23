export interface SportConfig {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
  season: {
    start: string;
    end: string;
    type: 'regular' | 'playoffs' | 'offseason';
  };
  statKeys: {
    team: Record<string, string>;
    player: Record<string, string>;
    game: Record<string, string>;
  };
  apiEndpoints: {
    games: string;
    liveGames: string;
    standings: string;
    teams: string;
    teamDetails: string;
    schedule: string;
  };
  displaySettings: {
    scoreFormat: 'standard' | 'innings';
    periodName: 'quarter' | 'inning' | 'period';
    maxPeriods: number;
  };
}

export const sportsConfig: Record<string, SportConfig> = {
  nfl: {
    id: 'nfl',
    name: 'nfl',
    displayName: 'NFL',
    icon: '🏈',
    color: {
      primary: 'blue',
      secondary: 'slate',
      accent: 'blue',
    },
    season: {
      start: '2024-09',
      end: '2025-02',
      type: 'regular',
    },
    statKeys: {
      team: {
        wins: 'wins',
        losses: 'losses',
        ties: 'ties',
        winPercentage: 'win_percentage',
        pointsFor: 'points_for',
        pointsAgainst: 'points_against',
        division: 'division',
        conference: 'conference',
      },
      player: {
        passingYards: 'passing_yards',
        rushingYards: 'rushing_yards',
        receivingYards: 'receiving_yards',
        touchdowns: 'touchdowns',
        interceptions: 'interceptions',
        sacks: 'sacks',
      },
      game: {
        homeScore: 'home_score',
        awayScore: 'away_score',
        homeTeam: 'home_team',
        awayTeam: 'away_team',
        quarter: 'quarter',
        timeRemaining: 'time_remaining',
        status: 'status',
        date: 'date',
      },
    },
    apiEndpoints: {
      games: '/v3/fixtures?league=1&season=2024',
      liveGames: '/v3/fixtures/live?league=1',
      standings: '/v3/standings?league=1&season=2024',
      teams: '/v3/teams?league=1',
      teamDetails: '/v3/teams/{teamId}?league=1',
      schedule: '/v3/fixtures?league=1&team={teamId}&season=2024',
    },
    displaySettings: {
      scoreFormat: 'standard',
      periodName: 'quarter',
      maxPeriods: 4,
    },
  },
  mlb: {
    id: 'mlb',
    name: 'mlb',
    displayName: 'MLB',
    icon: '⚾',
    color: {
      primary: 'green',
      secondary: 'emerald',
      accent: 'green',
    },
    season: {
      start: '2024-03',
      end: '2024-10',
      type: 'regular',
    },
    statKeys: {
      team: {
        wins: 'wins',
        losses: 'losses',
        winPercentage: 'win_percentage',
        runsFor: 'runs_for',
        runsAgainst: 'runs_against',
        division: 'division',
        league: 'league',
        gamesBack: 'games_back',
      },
      player: {
        battingAverage: 'batting_average',
        homeRuns: 'home_runs',
        rbi: 'rbi',
        era: 'era',
        wins: 'wins',
        saves: 'saves',
        strikeouts: 'strikeouts',
      },
      game: {
        homeScore: 'home_score',
        awayScore: 'away_score',
        homeTeam: 'home_team',
        awayTeam: 'away_team',
        inning: 'inning',
        inningHalf: 'inning_half',
        status: 'status',
        date: 'date',
      },
    },
    apiEndpoints: {
      games: '/v3/fixtures?league=1&season=2024', // Will be MLB league ID
      liveGames: '/v3/fixtures/live?league=1',
      standings: '/v3/standings?league=1&season=2024',
      teams: '/v3/teams?league=1',
      teamDetails: '/v3/teams/{teamId}?league=1',
      schedule: '/v3/fixtures?league=1&team={teamId}&season=2024',
    },
    displaySettings: {
      scoreFormat: 'innings',
      periodName: 'inning',
      maxPeriods: 9,
    },
  },
  // Future sports configs
  nhl: {
    id: 'nhl',
    name: 'nhl',
    displayName: 'NHL',
    icon: '🏒',
    color: {
      primary: 'red',
      secondary: 'slate',
      accent: 'red',
    },
    season: {
      start: '2024-10',
      end: '2025-06',
      type: 'regular',
    },
    statKeys: {
      team: {
        wins: 'wins',
        losses: 'losses',
        overtimeLosses: 'ot_losses',
        points: 'points',
        goalsFor: 'goals_for',
        goalsAgainst: 'goals_against',
        division: 'division',
        conference: 'conference',
      },
      player: {
        goals: 'goals',
        assists: 'assists',
        points: 'points',
        plusMinus: 'plus_minus',
        penaltyMinutes: 'penalty_minutes',
        saves: 'saves',
        goalsAgainstAverage: 'gaa',
      },
      game: {
        homeScore: 'home_score',
        awayScore: 'away_score',
        homeTeam: 'home_team',
        awayTeam: 'away_team',
        period: 'period',
        timeRemaining: 'time_remaining',
        status: 'status',
        date: 'date',
      },
    },
    apiEndpoints: {
      games: '/v3/fixtures?league=1&season=2024',
      liveGames: '/v3/fixtures/live?league=1',
      standings: '/v3/standings?league=1&season=2024',
      teams: '/v3/teams?league=1',
      teamDetails: '/v3/teams/{teamId}?league=1',
      schedule: '/v3/fixtures?league=1&team={teamId}&season=2024',
    },
    displaySettings: {
      scoreFormat: 'standard',
      periodName: 'period',
      maxPeriods: 3,
    },
  },
  nba: {
    id: 'nba',
    name: 'nba',
    displayName: 'NBA',
    icon: '🏀',
    color: {
      primary: 'orange',
      secondary: 'amber',
      accent: 'orange',
    },
    season: {
      start: '2024-10',
      end: '2025-06',
      type: 'regular',
    },
    statKeys: {
      team: {
        wins: 'wins',
        losses: 'losses',
        winPercentage: 'win_percentage',
        pointsFor: 'points_for',
        pointsAgainst: 'points_against',
        division: 'division',
        conference: 'conference',
      },
      player: {
        points: 'points',
        rebounds: 'rebounds',
        assists: 'assists',
        steals: 'steals',
        blocks: 'blocks',
        fieldGoalPercentage: 'fg_percentage',
        threePointPercentage: 'three_point_percentage',
      },
      game: {
        homeScore: 'home_score',
        awayScore: 'away_score',
        homeTeam: 'home_team',
        awayTeam: 'away_team',
        quarter: 'quarter',
        timeRemaining: 'time_remaining',
        status: 'status',
        date: 'date',
      },
    },
    apiEndpoints: {
      games: '/v3/fixtures?league=1&season=2024',
      liveGames: '/v3/fixtures/live?league=1',
      standings: '/v3/standings?league=1&season=2024',
      teams: '/v3/teams?league=1',
      teamDetails: '/v3/teams/{teamId}?league=1',
      schedule: '/v3/fixtures?league=1&team={teamId}&season=2024',
    },
    displaySettings: {
      scoreFormat: 'standard',
      periodName: 'quarter',
      maxPeriods: 4,
    },
  },
};

// Helper functions
export function getSportConfig(sportId: string): SportConfig | null {
  return sportsConfig[sportId] || null;
}

export function getAllSports(): SportConfig[] {
  return Object.values(sportsConfig);
}

export function getActiveSports(): SportConfig[] {
  // For now, return NFL and MLB as active
  return [sportsConfig.nfl, sportsConfig.mlb];
}

export function getSportByName(name: string): SportConfig | null {
  return Object.values(sportsConfig).find(sport => 
    sport.name.toLowerCase() === name.toLowerCase() ||
    sport.displayName.toLowerCase() === name.toLowerCase()
  ) || null;
}

// Type utilities
export type SportId = keyof typeof sportsConfig;
export type TeamStat = string;
export type PlayerStat = string;
export type GameStat = string;