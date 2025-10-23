// Base interfaces for sports data
export interface Team {
  id: string;
  externalId: string;
  sport: string;
  name: string;
  city: string;
  fullName: string;
  abbreviation: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  conference?: string;
  division?: string;
  venue?: string;
  founded?: number;
}

export interface Game {
  id: string;
  sport: string;
  date: string;
  status: GameStatus;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  period?: number;
  timeRemaining?: string;
  venue?: string;
  weather?: Weather;
}

export interface StandingsEntry {
  team: Team;
  wins: number;
  losses: number;
  ties?: number;
  winPercentage: number;
  gamesBack?: number;
  streak?: string;
  conference?: string;
  division?: string;
  position: number;
  // Sport-specific stats
  pointsFor?: number;
  pointsAgainst?: number;
  points?: number; // NHL points system
  overtimeLosses?: number; // NHL
}

export interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNumber: number;
  team: Team;
  stats?: Record<string, number | string>;
  photoUrl?: string;
  age?: number;
  height?: string;
  weight?: string;
}

// Enums and constants
export enum GameStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  IN_PROGRESS = 'in_progress',
  FINAL = 'final',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export interface Weather {
  temperature: number;
  condition: string;
  windSpeed?: number;
  humidity?: number;
}

// User-related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTeam {
  id: string;
  userId: string;
  teamId: string;
  sport: string;
  favoritedAt: Date;
  user?: User;
  team?: Team;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component prop types
export interface TeamCardProps {
  team: Team;
  showStats?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (teamId: string) => void;
}

export interface GameCardProps {
  game: Game;
  showDetails?: boolean;
  onClick?: (gameId: string) => void;
}

export interface ScoreWidgetProps {
  game: Game;
  size?: 'sm' | 'md' | 'lg';
  showTime?: boolean;
}

// Filter and search types
export interface GameFilters {
  sport?: string;
  status?: GameStatus;
  team?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TeamFilters {
  sport?: string;
  conference?: string;
  division?: string;
  search?: string;
}

// Cache-related types
export interface CacheOptions {
  revalidate?: number;
  tags?: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
}

// Error types
export class SportsAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'SportsAPIError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Utility types
export type SportId = 'nfl' | 'mlb' | 'nhl' | 'nba';
export type TeamStat = keyof StandingsEntry;
export type GamePeriod = number;
export type ScoreDisplay = 'standard' | 'innings';

// Form types for user interactions
export interface FavoriteTeamForm {
  teamId: string;
  sport: string;
}

export interface UserPreferences {
  favoriteTeams: string[];
  defaultSport: SportId;
  notifications: {
    gameStart: boolean;
    scoreUpdates: boolean;
    finalScores: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}