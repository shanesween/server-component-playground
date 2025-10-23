ALTER TABLE "sms_verification_codes" ADD COLUMN "max_attempts" integer DEFAULT 3;--> statement-breakpoint
ALTER TABLE "sms_verification_codes" ADD COLUMN "ip_address" varchar(45);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_sign_in" timestamp;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";