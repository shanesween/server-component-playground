import { getSportConfig } from '../sports/config';

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_SPORTS_API_URL || 'https://api-football-v1.p.rapidapi.com/v3';
const API_KEY = process.env.SPORTS_API_KEY || '';

// API Client class
class SportsAPIClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Generic method to make cached requests
  async getCachedData(endpoint: string, cacheOptions: {
    revalidate?: number;
    tags?: string[];
  } = {}) {
    const { revalidate = 300, tags = [] } = cacheOptions;

    return this.makeRequest(endpoint, {
      next: {
        revalidate,
        tags,
      },
    });
  }
}

// Singleton instance
export const sportsAPI = new SportsAPIClient(API_BASE, API_KEY);

// Team-related API functions with caching
export async function getAllTeams(sport: string) {
  const config = getSportConfig(sport);
  if (!config) throw new Error(`Unknown sport: ${sport}`);

  return sportsAPI.getCachedData(config.apiEndpoints.teams, {
    revalidate: 86400, // 24 hours - team data rarely changes
    tags: [`${sport}-teams`, 'teams'],
  });
}

export async function getTeamById(teamId: string, sport: string) {
  const config = getSportConfig(sport);
  if (!config) throw new Error(`Unknown sport: ${sport}`);

  const endpoint = config.apiEndpoints.teamDetails.replace('{teamId}', teamId);

  return sportsAPI.getCachedData(endpoint, {
    revalidate: 3600, // 1 hour
    tags: [`team-${teamId}`, `${sport}-teams`],
  });
}

// Game-related API functions with caching
export async function getLiveGames(sport: string) {
  const config = getSportConfig(sport);
  if (!config) throw new Error(`Unknown sport: ${sport}`);

  return sportsAPI.getCachedData(config.apiEndpoints.liveGames, {
    revalidate: 15, // 15 seconds for live data
    tags: [`${sport}-live-games`, 'live-scores'],
  });
}

export async function getRecentGames(sport: string, days: number = 7) {
  const config = getSportConfig(sport);
  if (!config) throw new Error(`Unknown sport: ${sport}`);

  // Calculate date range for recent games
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const endpoint = `${config.apiEndpoints.games}&from=${startDate.toISOString().split('T')[0]}&to=${endDate.toISOString().split('T')[0]}`;

  return sportsAPI.getCachedData(endpoint, {
    revalidate: 60, // 1 minute
    tags: [`${sport}-recent-games`, 'games'],
  });
}

export async function getTeamSchedule(teamId: string, sport: string) {
  const config = getSportConfig(sport);
  if (!config) throw new Error(`Unknown sport: ${sport}`);

  const endpoint = config.apiEndpoints.schedule.replace('{teamId}', teamId);

  return sportsAPI.getCachedData(endpoint, {
    revalidate: 300, // 5 minutes
    tags: [`team-${teamId}-schedule`, `${sport}-schedules`],
  });
}

// Standings API functions with caching
export async function getStandings(sport: string) {
  const config = getSportConfig(sport);
  if (!config) throw new Error(`Unknown sport: ${sport}`);

  return sportsAPI.getCachedData(config.apiEndpoints.standings, {
    revalidate: 300, // 5 minutes
    tags: [`${sport}-standings`, 'standings'],
  });
}

// Cache invalidation functions
export async function invalidateTeamData(teamId: string, sport: string) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(`team-${teamId}`, 'default');
  revalidateTag(`${sport}-teams`, 'default');
}

export async function invalidateStandings(sport: string) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(`${sport}-standings`, 'default');
}

export async function refreshLiveScores() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('live-scores', 'default');
}

export async function invalidateAllSportData(sport: string) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(`${sport}-teams`, 'default');
  revalidateTag(`${sport}-standings`, 'default');
  revalidateTag(`${sport}-live-games`, 'default');
  revalidateTag(`${sport}-recent-games`, 'default');
}