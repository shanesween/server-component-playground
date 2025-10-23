import { pgTable, text, integer, timestamp, boolean, serial, varchar, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Teams table (supports multiple sports)
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id', { length: 50 }).notNull(), // API team ID
  sport: varchar('sport', { length: 20 }).notNull(), // 'nfl', 'mlb', etc.
  name: varchar('name', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  fullName: varchar('full_name', { length: 200 }).notNull(),
  abbreviation: varchar('abbreviation', { length: 10 }).notNull(),
  logoUrl: text('logo_url'),
  primaryColor: varchar('primary_color', { length: 7 }), // Hex color
  secondaryColor: varchar('secondary_color', { length: 7 }),
  conference: varchar('conference', { length: 50 }),
  division: varchar('division', { length: 50 }),
  venue: varchar('venue', { length: 200 }),
  founded: integer('founded'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ([
  unique().on(table.externalId, table.sport),
]));

// UserToTeam relational table (favorites)
export const userToTeam = pgTable('user_to_team', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  teamId: integer('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
  sport: varchar('sport', { length: 20 }).notNull(),
  favoritedAt: timestamp('favorited_at').defaultNow().notNull(),
}, (table) => ([
  unique().on(table.userId, table.teamId),
]));

// User preferences table
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  defaultSport: varchar('default_sport', { length: 20 }).default('nfl'),
  notificationsEnabled: boolean('notifications_enabled').default(true),
  gameStartNotifications: boolean('game_start_notifications').default(true),
  scoreUpdateNotifications: boolean('score_update_notifications').default(false),
  finalScoreNotifications: boolean('final_score_notifications').default(true),
  theme: varchar('theme', { length: 10 }).default('system'), // 'light', 'dark', 'system'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Games cache table (for performance)
export const gamesCache = pgTable('games_cache', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id', { length: 50 }).notNull(),
  sport: varchar('sport', { length: 20 }).notNull(),
  homeTeamId: integer('home_team_id').references(() => teams.id),
  awayTeamId: integer('away_team_id').references(() => teams.id),
  homeScore: integer('home_score').default(0),
  awayScore: integer('away_score').default(0),
  status: varchar('status', { length: 20 }).notNull(), // 'scheduled', 'live', 'final', etc.
  gameDate: timestamp('game_date').notNull(),
  period: integer('period'),
  timeRemaining: varchar('time_remaining', { length: 50 }),
  venue: varchar('venue', { length: 200 }),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ([
  unique().on(table.externalId, table.sport),
]));

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  favoriteTeams: many(userToTeam),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  favoritedBy: many(userToTeam),
  homeGames: many(gamesCache, { relationName: 'homeTeam' }),
  awayGames: many(gamesCache, { relationName: 'awayTeam' }),
}));

export const userToTeamRelations = relations(userToTeam, ({ one }) => ({
  user: one(users, {
    fields: [userToTeam.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [userToTeam.teamId],
    references: [teams.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const gamesCacheRelations = relations(gamesCache, ({ one }) => ({
  homeTeam: one(teams, {
    fields: [gamesCache.homeTeamId],
    references: [teams.id],
    relationName: 'homeTeam',
  }),
  awayTeam: one(teams, {
    fields: [gamesCache.awayTeamId],
    references: [teams.id],
    relationName: 'awayTeam',
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type UserTeam = typeof userToTeam.$inferSelect;
export type NewUserTeam = typeof userToTeam.$inferInsert;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;

export type GameCache = typeof gamesCache.$inferSelect;
export type NewGameCache = typeof gamesCache.$inferInsert;