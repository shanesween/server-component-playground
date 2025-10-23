CREATE TABLE "games_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(50) NOT NULL,
	"sport" varchar(20) NOT NULL,
	"home_team_id" integer,
	"away_team_id" integer,
	"home_score" integer DEFAULT 0,
	"away_score" integer DEFAULT 0,
	"status" varchar(20) NOT NULL,
	"game_date" timestamp NOT NULL,
	"period" integer,
	"time_remaining" varchar(50),
	"venue" varchar(200),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "games_cache_external_id_sport_unique" UNIQUE("external_id","sport")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(50) NOT NULL,
	"sport" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"full_name" varchar(200) NOT NULL,
	"abbreviation" varchar(10) NOT NULL,
	"logo_url" text,
	"primary_color" varchar(7),
	"secondary_color" varchar(7),
	"conference" varchar(50),
	"division" varchar(50),
	"venue" varchar(200),
	"founded" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teams_external_id_sport_unique" UNIQUE("external_id","sport")
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"default_sport" varchar(20) DEFAULT 'nfl',
	"notifications_enabled" boolean DEFAULT true,
	"game_start_notifications" boolean DEFAULT true,
	"score_update_notifications" boolean DEFAULT false,
	"final_score_notifications" boolean DEFAULT true,
	"theme" varchar(10) DEFAULT 'system',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_to_team" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"sport" varchar(20) NOT NULL,
	"favorited_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_to_team_user_id_team_id_unique" UNIQUE("user_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "games_cache" ADD CONSTRAINT "games_cache_home_team_id_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games_cache" ADD CONSTRAINT "games_cache_away_team_id_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_team" ADD CONSTRAINT "user_to_team_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_to_team" ADD CONSTRAINT "user_to_team_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;