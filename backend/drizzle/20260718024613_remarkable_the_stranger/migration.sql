CREATE TYPE "ai_report_type" AS ENUM('scheduled_reflection', 'emergency_replan', 'stat_projection');--> statement-breakpoint
CREATE TYPE "api_key_provider" AS ENUM('openai', 'anthropic', 'google', 'other');--> statement-breakpoint
CREATE TYPE "chat_role" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TYPE "chat_session_status" AS ENUM('open', 'resolved');--> statement-breakpoint
CREATE TYPE "entity_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "habit_log_status" AS ENUM('done', 'skipped', 'missed');--> statement-breakpoint
CREATE TYPE "habit_target_type" AS ENUM('boolean', 'count', 'duration');--> statement-breakpoint
CREATE TYPE "plan_status" AS ENUM('active', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "plan_type" AS ENUM('weekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "reflection_type" AS ENUM('goal', 'pain_point', 'dream');--> statement-breakpoint
CREATE TYPE "todo_source" AS ENUM('user', 'ai');--> statement-breakpoint
CREATE TABLE "ai_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"type" "ai_report_type" NOT NULL,
	"period_start" date,
	"period_end" date,
	"summary" text NOT NULL,
	"content" jsonb NOT NULL,
	"model_used" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_usage_quotas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"period_month" date NOT NULL,
	"tokens_used" integer DEFAULT 0 NOT NULL,
	"token_limit" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emergency_chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"role" "chat_role" NOT NULL,
	"content" text NOT NULL,
	"tokens_used" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emergency_chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"summary" text,
	"status" "chat_session_status" DEFAULT 'open'::"chat_session_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "habit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"habit_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"status" "habit_log_status" DEFAULT 'done'::"habit_log_status" NOT NULL,
	"value" numeric,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habit_streaks" (
	"habit_id" uuid PRIMARY KEY,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"completion_rate_30d" numeric,
	"completion_rate_90d" numeric,
	"last_calculated_date" date,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"target_type" "habit_target_type" DEFAULT 'boolean'::"habit_target_type" NOT NULL,
	"target_value" numeric,
	"unit" text,
	"color" text,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"plan_id" uuid NOT NULL,
	"title" text NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"due_date" date,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"goal_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"type" "plan_type" NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"status" "plan_status" DEFAULT 'active'::"plan_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reflections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"type" "reflection_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_date" date,
	"metadata" jsonb,
	"status" "entity_status" DEFAULT 'active'::"entity_status" NOT NULL,
	"slot_index" smallint,
	"previous_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "routine_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"routine_profile_id" uuid NOT NULL,
	"label" text NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"day_of_week" smallint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routine_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"status" "entity_status" DEFAULT 'active'::"entity_status" NOT NULL,
	"previous_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"plan_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"date" date NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"source" "todo_source" DEFAULT 'user'::"todo_source" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"provider" "api_key_provider" NOT NULL,
	"encrypted_key" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"google_id" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"avatar_url" text,
	"onboarding_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ai_reports_user_created_idx" ON "ai_reports" ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_usage_user_period_unique" ON "ai_usage_quotas" ("user_id","period_month");--> statement-breakpoint
CREATE INDEX "emergency_messages_session_created_idx" ON "emergency_chat_messages" ("session_id","created_at");--> statement-breakpoint
CREATE INDEX "emergency_sessions_user_status_idx" ON "emergency_chat_sessions" ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "habit_logs_habit_date_unique" ON "habit_logs" ("habit_id","date");--> statement-breakpoint
CREATE INDEX "habit_logs_user_date_idx" ON "habit_logs" ("user_id","date");--> statement-breakpoint
CREATE INDEX "habits_user_idx" ON "habits" ("user_id");--> statement-breakpoint
CREATE INDEX "plan_items_plan_idx" ON "plan_items" ("plan_id");--> statement-breakpoint
CREATE INDEX "plans_user_type_idx" ON "plans" ("user_id","type");--> statement-breakpoint
CREATE INDEX "reflections_user_type_status_idx" ON "reflections" ("user_id","type","status");--> statement-breakpoint
CREATE INDEX "routine_blocks_profile_idx" ON "routine_blocks" ("routine_profile_id");--> statement-breakpoint
CREATE INDEX "routine_profiles_user_status_idx" ON "routine_profiles" ("user_id","status");--> statement-breakpoint
CREATE INDEX "todos_user_date_idx" ON "todos" ("user_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "user_api_keys_user_provider_unique" ON "user_api_keys" ("user_id","provider");--> statement-breakpoint
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ai_usage_quotas" ADD CONSTRAINT "ai_usage_quotas_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "emergency_chat_messages" ADD CONSTRAINT "emergency_chat_messages_swHYqB7s6wHn_fkey" FOREIGN KEY ("session_id") REFERENCES "emergency_chat_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "emergency_chat_sessions" ADD CONSTRAINT "emergency_chat_sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_habit_id_habits_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "habit_logs" ADD CONSTRAINT "habit_logs_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "habit_streaks" ADD CONSTRAINT "habit_streaks_habit_id_habits_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "plan_items" ADD CONSTRAINT "plan_items_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_goal_id_reflections_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "reflections"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "routine_blocks" ADD CONSTRAINT "routine_blocks_routine_profile_id_routine_profiles_id_fkey" FOREIGN KEY ("routine_profile_id") REFERENCES "routine_profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "routine_profiles" ADD CONSTRAINT "routine_profiles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "user_api_keys" ADD CONSTRAINT "user_api_keys_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;