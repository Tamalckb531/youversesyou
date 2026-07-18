CREATE TYPE "user_status" AS ENUM('dormant', 'disrupted', 'uncertain');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "avatar_url" TO "status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "user_status" USING "status"::"user_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET NOT NULL;