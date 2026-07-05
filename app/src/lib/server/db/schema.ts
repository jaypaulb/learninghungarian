import {
  pgTable,
  pgEnum,
  text,
  uuid,
  timestamp,
  integer,
  jsonb,
  primaryKey
} from 'drizzle-orm/pg-core';

// Minimal table proving migrations run end-to-end.
export const appMeta = pgTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull()
});

// ---------------------------------------------------------------------------
// Accounts (SP1 Plan 2). Identity arrives via trusted X-Forwarded-User header
// during the gated testing phase; rows auto-provision on first request.
// ---------------------------------------------------------------------------
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export type User = typeof users.$inferSelect;

// ---------------------------------------------------------------------------
// Tier-aware content model (SP1 Plan 3). Stable text IDs (author-chosen
// slugs) everywhere so user progress survives re-imports; content_version
// is author-managed and bumped on any content change (drift-guarded).
// ---------------------------------------------------------------------------
export const cefrTier = pgEnum('cefr_tier', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
export const lessonStatus = pgEnum('lesson_status', ['draft', 'reviewed', 'community_verified']);

export const modules = pgTable('modules', {
  id: text('id').primaryKey(),
  tier: cefrTier('tier').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  position: integer('position').notNull()
});

export const lessons = pgTable('lessons', {
  id: text('id').primaryKey(),
  moduleId: text('module_id')
    .notNull()
    .references(() => modules.id),
  position: integer('position').notNull(),
  title: text('title').notNull(),
  objectives: jsonb('objectives').$type<string[]>().notNull().default([]),
  prerequisites: jsonb('prerequisites').$type<string[]>().notNull().default([]),
  skillTags: jsonb('skill_tags').$type<string[]>().notNull().default([]),
  status: lessonStatus('status').notNull().default('draft'),
  contentVersion: integer('content_version').notNull().default(1),
  sources: jsonb('sources').$type<string[]>().notNull().default([]),
  provenance: jsonb('provenance').$type<Record<string, string>>().notNull().default({}),
  estimatedMinutes: integer('estimated_minutes')
});

export const contentBlocks = pgTable(
  'content_blocks',
  {
    lessonId: text('lesson_id')
      .notNull()
      .references(() => lessons.id),
    position: integer('position').notNull(),
    type: text('type').notNull(), // prose | table | example | callout
    payload: jsonb('payload').notNull()
  },
  (t) => [primaryKey({ columns: [t.lessonId, t.position] })]
);

export const assessments = pgTable('assessments', {
  id: text('id').primaryKey(),
  tier: cefrTier('tier').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  position: integer('position').notNull().default(0)
});

// An exercise belongs to a lesson OR an assessment (exactly one set).
export const exercises = pgTable('exercises', {
  id: text('id').primaryKey(),
  lessonId: text('lesson_id').references(() => lessons.id),
  assessmentId: text('assessment_id').references(() => assessments.id),
  position: integer('position').notNull(),
  type: text('type').notNull(),
  payloadSchemaVersion: integer('payload_schema_version').notNull().default(1),
  payload: jsonb('payload').notNull(),
  contentVersion: integer('content_version').notNull().default(1)
});

export const srsItems = pgTable('srs_items', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(), // vocab | grammar
  payload: jsonb('payload').notNull()
});

export const exerciseSrsItems = pgTable(
  'exercise_srs_items',
  {
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id),
    srsItemId: text('srs_item_id')
      .notNull()
      .references(() => srsItems.id)
  },
  (t) => [primaryKey({ columns: [t.exerciseId, t.srsItemId] })]
);

export type Lesson = typeof lessons.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
