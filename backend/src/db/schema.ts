import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  smallint,
  numeric,
  date,
  time,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { defineRelations, sql } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────
//? ENUMS
// ─────────────────────────────────────────────────────────────

export const userStatus = pgEnum("user_status", ["pending", "dormant", "disrupted","uncertain"]);
export const entityStatusEnum = pgEnum("entity_status", ["active", "archived"]);
export const reflectionTypeEnum = pgEnum("reflection_type", ["goal", "pain_point", "dream"]);
export const habitTargetTypeEnum = pgEnum("habit_target_type", ["boolean", "count", "duration"]);
export const habitLogStatusEnum = pgEnum("habit_log_status", ["done", "skipped", "missed"]);
export const planTypeEnum = pgEnum("plan_type", ["weekly", "monthly", "yearly", "overall"]);
export const planStatusEnum = pgEnum("plan_status", ["active", "completed", "abandoned"]);
export const todoSourceEnum = pgEnum("todo_source", ["user", "ai"]);
export const aiReportTypeEnum = pgEnum("ai_report_type", [
  "scheduled_reflection", // type-2/3 periodic agent report
  "emergency_replan",     // triggered from emergency chat
  "stat_projection",      // type-3 "if you continue this..." report
]);
export const chatSessionStatusEnum = pgEnum("chat_session_status", ["open", "resolved"]);
export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant"]);
export const apiKeyProviderEnum = pgEnum("api_key_provider", ["openai", "anthropic", "google", "other"]);

// ─────────────────────────────────────────────────────────────
//? USERS
// ─────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  googleId: text("google_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  status: userStatus("status").notNull(),
  onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────
//? Better Auth
// ─────────────────────────────────────────────────────────────

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});


export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"), // unused — no emailAndPassword provider
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});


// ─────────────────────────────────────────────────────────────
//? REFLECTIONS — Goals / Pain Points / Dreams (unified, versioned)
// Business rule: max 5 active per (userId, type) — enforced in service layer.
// Business rule: 4-month edit lock — enforced by reading latest active row's
// createdAt in service layer; editing = archive old row + insert new row.
// ─────────────────────────────────────────────────────────────

export const reflections = pgTable(
  "reflections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: reflectionTypeEnum("type").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    targetDate: date("target_date"),
    // type-specific extras (e.g. dream.estimatedCost) without schema churn
    metadata: jsonb("metadata"),
    status: entityStatusEnum("status").notNull().default("active"),
    slotIndex: smallint("slot_index").notNull(), // 1–5, display ordering only, not DB-enforced
    previousVersionId: uuid("previous_version_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    index("reflections_user_type_status_idx").on(
      table.userId,
      table.type,
      table.status,
    ),
  ],
);

// ─────────────────────────────────────────────────────────────
// ROUTINE — versioned like reflections, 1-month edit lock
// ─────────────────────────────────────────────────────────────

export const routineProfiles = pgTable(
  "routine_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: entityStatusEnum("status").notNull().default("active"),
    previousVersionId: uuid("previous_version_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    index("routine_profiles_user_status_idx").on(table.userId, table.status),
  ],
);

//TODO: Some routines are must to follow like schools and stuff and some can be extended. We can add this feature here 
export const routineBlocks = pgTable(
  "routine_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    routineProfileId: uuid("routine_profile_id")
      .notNull()
      .references(() => routineProfiles.id, { onDelete: "cascade" }),
    label: text("label").notNull(), // "School", "Job", "Goal time"
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    dayOfWeek: smallint("day_of_week"), // 0-6, null = every day
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("routine_blocks_profile_idx").on(table.routineProfileId),
  ],
);

// ─────────────────────────────────────────────────────────────
// HABITS
// ─────────────────────────────────────────────────────────────

export const habits = pgTable(
  "habits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    targetType: habitTargetTypeEnum("target_type").notNull().default("boolean"),
    targetValue: numeric("target_value"), // used when count/duration
    unit: text("unit"), // "minutes", "pages", etc.
    color: text("color"),
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("habits_user_idx").on(table.userId),
  ],
);

//! One row per habit per day — this table IS the heatmap source of truth.
// Unique (habitId, date) prevents double-checkins from corrupting streaks.
export const habitLogs = pgTable(
  "habit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    habitId: uuid("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    // Denormalized on purpose: avoids a join on habits for every dashboard/
    // heatmap/AI-context read, which is the hottest read path in the app.
    // Kept consistent because it's set once at insert from habits.userId.
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    status: habitLogStatusEnum("status").notNull().default("done"),
    value: numeric("value"), // for count/duration habit types
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("habit_logs_habit_date_unique").on(table.habitId, table.date),
    index("habit_logs_user_date_idx").on(table.userId, table.date),
  ],
);

// Cache table, recomputed by scheduled job — not live-computed on read.
// Justified: streak/heatmap-range queries over years of logs are expensive
// to run on every dashboard load at scale.
export const habitStreaks = pgTable("habit_streaks", {
  habitId: uuid("habit_id")
    .primaryKey()
    .references(() => habits.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  completionRate30d: numeric("completion_rate_30d"),
  completionRate90d: numeric("completion_rate_90d"),
  lastCalculatedDate: date("last_calculated_date"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────
// PLANS (weekly/monthly/yearly) + TODOS
// ─────────────────────────────────────────────────────────────

export const plans = pgTable(
  "plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    type: planTypeEnum("type").notNull(),
    // null for overall; "2025" for yearly; "Jan".."Dec" for monthly; "Week1".."Week52" for weekly
    time: text("time"),
    status: planStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("plans_user_type_idx").on(table.userId, table.type),
    check(
      "plans_time_matches_type",
      sql`(${table.type} = 'overall' AND ${table.time} IS NULL) OR (${table.type} != 'overall' AND ${table.time} IS NOT NULL)`,
    ),
  ],
);

// junction: reflections <-> overall plans (many-to-many)
// semantically valid only when plan.type = 'overall'
export const reflectionPlans = pgTable(
  "reflection_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reflectionId: uuid("reflection_id")
      .notNull()
      .references(() => reflections.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("reflection_plans_unique").on(table.reflectionId, table.planId),
    index("reflection_plans_plan_idx").on(table.planId),
  ],
);

// junction: plan <-> plan, self-referential many-to-many, strictly one level apart
// hierarchy: overall -> yearly -> monthly -> weekly; parentPlanId is always the coarser type
export const planRelations = pgTable(
  "plan_relations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parentPlanId: uuid("parent_plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    childPlanId: uuid("child_plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("plan_relations_unique").on(table.parentPlanId, table.childPlanId),
    index("plan_relations_child_idx").on(table.childPlanId),
    check("plan_relations_no_self_link", sql`${table.parentPlanId} != ${table.childPlanId}`),
  ],
);
 

export const todos = pgTable(
  "todos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: uuid("plan_id").references(() => plans.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    date: date("date").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    source: todoSourceEnum("source").notNull().default("user"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("todos_user_date_idx").on(table.userId, table.date),
  ],
);

// ─────────────────────────────────────────────────────────────
// AI REPORTS
// ─────────────────────────────────────────────────────────────

export const aiReports = pgTable(
  "ai_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: aiReportTypeEnum("type").notNull(),
    periodStart: date("period_start"),
    periodEnd: date("period_end"),
    summary: text("summary").notNull(),
    content: jsonb("content").notNull(), // structured recommendations/decisions
    modelUsed: text("model_used"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("ai_reports_user_created_idx").on(table.userId, table.createdAt),
  ],
);

// ─────────────────────────────────────────────────────────────
// EMERGENCY CHAT
// ─────────────────────────────────────────────────────────────

export const emergencyChatSessions = pgTable(
  "emergency_chat_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    summary: text("summary"),
    status: chatSessionStatusEnum("status").notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [
    index("emergency_sessions_user_status_idx").on(table.userId, table.status),
  ],
);

export const emergencyChatMessages = pgTable(
  "emergency_chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => emergencyChatSessions.id, { onDelete: "cascade" }),
    role: chatRoleEnum("role").notNull(),
    content: text("content").notNull(),
    tokensUsed: integer("tokens_used"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("emergency_messages_session_created_idx").on(
      table.sessionId,
      table.createdAt,
    ),
  ],
);

// ─────────────────────────────────────────────────────────────
// AI USAGE QUOTA + BYOK KEYS
// ─────────────────────────────────────────────────────────────

export const aiUsageQuotas = pgTable(
  "ai_usage_quotas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    periodMonth: date("period_month").notNull(), // always first-of-month
    tokensUsed: integer("tokens_used").notNull().default(0),
    tokenLimit: integer("token_limit").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("ai_usage_user_period_unique").on(
      table.userId,
      table.periodMonth,
    ),
  ],
);

export const userApiKeys = pgTable(
  "user_api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: apiKeyProviderEnum("provider").notNull(),
    encryptedKey: text("encrypted_key").notNull(), // ciphertext only; app layer handles KMS
    isDefault: boolean("is_default").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_api_keys_user_provider_unique").on(
      table.userId,
      table.provider,
    ),
  ],
);

// ─────────────────────────────────────────────────────────────
// RELATIONS (rc.4 relational API — defineRelations)
//
// IMPORTANT: unlike the old `relations()` helper, rc.4 requires BOTH sides
// of every relation to be declared explicitly. A `many` on the parent with
// no matching `one` (with from/to) on the child fails at db:push with
// "not enough data provided to build the relation". Every FK below has
// its `one` side declared on the child, matched by a `many` on the parent.
// ─────────────────────────────────────────────────────────────

export const dbRelations = defineRelations(
  {
    users,
    reflections,
    routineProfiles,
    routineBlocks,
    habits,
    habitLogs,
    habitStreaks,
    plans,
    reflectionPlans,
    planRelations,
    todos,
    aiReports,
    emergencyChatSessions,
    emergencyChatMessages,
    aiUsageQuotas,
    userApiKeys,
  },
  (r) => ({
    users: {
      reflections: r.many.reflections(),
      routineProfiles: r.many.routineProfiles(),
      habits: r.many.habits(),
      habitLogs: r.many.habitLogs(),
      plans: r.many.plans(),
      todos: r.many.todos(),
      aiReports: r.many.aiReports(),
      emergencyChatSessions: r.many.emergencyChatSessions(),
      aiUsageQuotas: r.many.aiUsageQuotas(),
      userApiKeys: r.many.userApiKeys(),
    },

    reflections: {
      user: r.one.users({
        from: r.reflections.userId,
        to: r.users.id,
      }),
      reflectionPlans: r.many.reflectionPlans(),
    },

    routineProfiles: {
      user: r.one.users({
        from: r.routineProfiles.userId,
        to: r.users.id,
      }),
      blocks: r.many.routineBlocks(),
    },

    routineBlocks: {
      routineProfile: r.one.routineProfiles({
        from: r.routineBlocks.routineProfileId,
        to: r.routineProfiles.id,
      }),
    },

    habits: {
      user: r.one.users({
        from: r.habits.userId,
        to: r.users.id,
      }),
      logs: r.many.habitLogs(),
      streak: r.one.habitStreaks(),
    },

    habitLogs: {
      habit: r.one.habits({
        from: r.habitLogs.habitId,
        to: r.habits.id,
      }),
      user: r.one.users({
        from: r.habitLogs.userId,
        to: r.users.id,
      }),
    },

    habitStreaks: {
      habit: r.one.habits({
        from: r.habitStreaks.habitId,
        to: r.habits.id,
      }),
    },

    plans: {
      user: r.one.users({
        from: r.plans.userId,
        to: r.users.id,
      }),
      reflectionPlans: r.many.reflectionPlans(),
      // this plan as a parent (coarser) linking down to finer child plans
      childRelations: r.many.planRelations({
        from: r.plans.id,
        to: r.planRelations.parentPlanId,
      }),
      // this plan as a child (finer) linking up to coarser parent plans
      parentRelations: r.many.planRelations({
        from: r.plans.id,
        to: r.planRelations.childPlanId,
      }),
    },

    reflectionPlans: {
      reflection: r.one.reflections({
        from: r.reflectionPlans.reflectionId,
        to: r.reflections.id,
      }),
      plan: r.one.plans({
        from: r.reflectionPlans.planId,
        to: r.plans.id,
      }),
    },
    planRelations: {
      parent: r.one.plans({
        from: r.planRelations.parentPlanId,
        to: r.plans.id,
      }),
      child: r.one.plans({
        from: r.planRelations.childPlanId,
        to: r.plans.id,
      }),
    },

    todos: {
      user: r.one.users({
        from: r.todos.userId,
        to: r.users.id,
      }),
      plan: r.one.plans({
        from: r.todos.planId,
        to: r.plans.id,
      }),
    },

    aiReports: {
      user: r.one.users({
        from: r.aiReports.userId,
        to: r.users.id,
      }),
    },

    emergencyChatSessions: {
      user: r.one.users({
        from: r.emergencyChatSessions.userId,
        to: r.users.id,
      }),
      messages: r.many.emergencyChatMessages(),
    },

    emergencyChatMessages: {
      session: r.one.emergencyChatSessions({
        from: r.emergencyChatMessages.sessionId,
        to: r.emergencyChatSessions.id,
      }),
    },

    aiUsageQuotas: {
      user: r.one.users({
        from: r.aiUsageQuotas.userId,
        to: r.users.id,
      }),
    },

    userApiKeys: {
      user: r.one.users({
        from: r.userApiKeys.userId,
        to: r.users.id,
      }),
    },
  }),
);