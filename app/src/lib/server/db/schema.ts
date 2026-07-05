import { pgTable, text } from 'drizzle-orm/pg-core';

// Minimal table proving migrations run end-to-end.
// Real domain tables arrive in later plans.
export const appMeta = pgTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull()
});
