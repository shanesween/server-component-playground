import { pgTable, text, integer, timestamp, boolean, serial, varchar, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Users table - Phone-first authentication (NextAuth compatible)
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  name: text('name'), // NextAuth required field
  email: text('email').unique(), // NextAuth required field (optional for phone auth)
  emailVerified: timestamp('email_verified'), // NextAuth required field
  image: text('image'), // NextAuth required field
  phoneNumber: varchar('phone_number', { length: 20 }).unique(), // E.164 format
  phoneVerified: boolean('phone_verified').default(false),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  displayName: varchar('display_name', { length: 100 }), // Computed: firstName + lastName
  onboardingCompleted: boolean('onboarding_completed').default(false),
  lastSignIn: timestamp('last_sign_in'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// OAuth Accounts table (NextAuth compatible) - kept for NextAuth compatibility
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ([
  unique().on(table.provider, table.providerAccountId),
]));

// Sessions table (NextAuth compatible)
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey().$defaultFn(() => nanoid()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expires: timestamp('expires').notNull(),
});

// Verification tokens table (NextAuth compatible)
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().$defaultFn(() => nanoid()),
  expires: timestamp('expires').notNull(),
}, (table) => ([
  unique().on(table.identifier, table.token),
]));

// SMS verification codes table - Optimized for UX
export const smsVerificationCodes = pgTable('sms_verification_codes', {
  id: serial('id').primaryKey(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(), // 6-digit code
  attempts: integer('attempts').default(0),
  maxAttempts: integer('max_attempts').default(3), // Rate limiting
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  verifiedAt: timestamp('verified_at'),
  ipAddress: varchar('ip_address', { length: 45 }), // For rate limiting
}, (table) => ([
  unique().on(table.phoneNumber, table.code),
]));

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
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  teamId: integer('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
  sport: varchar('sport', { length: 20 }).notNull(),
  favoritedAt: timestamp('favorited_at').defaultNow().notNull(),
}, (table) => ([
  unique().on(table.userId, table.teamId),
]));

// User preferences table
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
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
  sessions: many(sessions),
}));

// Note: Accounts relations removed - using phone-only authentication

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
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

// Note: Account types removed - using phone-only authentication

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;

export type SmsVerificationCode = typeof smsVerificationCodes.$inferSelect;
export type NewSmsVerificationCode = typeof smsVerificationCodes.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type UserTeam = typeof userToTeam.$inferSelect;
export type NewUserTeam = typeof userToTeam.$inferInsert;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;

export type GameCache = typeof gamesCache.$inferSelect;
export type NewGameCache = typeof gamesCache.$inferInsert;