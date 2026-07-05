import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

// Minimal table proving migrations run end-to-end.
// Real domain tables arrive in later plans.
export const appMeta = pgTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull()
});

// Accounts (SP1 Plan 2). Identity arrives via trusted X-Forwarded-User
// header during the gated testing phase; rows are auto-provisioned on
// first authenticated request. See plans/2026-07-05-sp1-plan2-auth.md.
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export type User = typeof users.$inferSelect;
