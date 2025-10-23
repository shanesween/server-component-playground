import { PgTransaction } from 'drizzle-orm/pg-core';
import { VercelPgQueryResultHKT } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';

export type DrizzleTransaction = PgTransaction<
  VercelPgQueryResultHKT,
  typeof schema,
  'async'
>;

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User service types
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
}

export interface UserWithPreferences {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    defaultSport: string;
    notificationsEnabled: boolean;
    gameStartNotifications: boolean;
    scoreUpdateNotifications: boolean;
    finalScoreNotifications: boolean;
    theme: string;
  } | null;
}

// Team service types
export interface TeamWithFavoriteStatus {
  id: number;
  externalId: string;
  sport: string;
  name: string;
  city: string;
  fullName: string;
  abbreviation: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  conference: string | null;
  division: string | null;
  venue: string | null;
  founded: number | null;
  isFavorite: boolean;
}

// Favorites service types
export interface FavoriteTeamRequest {
  teamId: number;
  sport: string;
}

export interface UserFavoriteTeam {
  id: number;
  userId: number;
  teamId: number;
  sport: string;
  favoritedAt: Date;
  team: {
    id: number;
    externalId: string;
    name: string;
    city: string;
    fullName: string;
    abbreviation: string;
    logoUrl: string | null;
    primaryColor: string | null;
    conference: string | null;
    division: string | null;
  };
}