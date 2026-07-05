import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { exerciseProgress, lessonProgress, userSrsState, feedback } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GDPR data portability: everything we hold about the requesting user,
 * as a JSON download. Later plans (feedback) append their sections here —
 * this endpoint is THE canonical exporter.
 */
export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const db = getDb();
  const body = {
    exportedAt: new Date().toISOString(),
    user: locals.user,
    lessonProgress: await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, locals.user.id)),
    exerciseProgress: await db
      .select()
      .from(exerciseProgress)
      .where(eq(exerciseProgress.userId, locals.user.id)),
    srs: await db.select().from(userSrsState).where(eq(userSrsState.userId, locals.user.id)),
    feedback: await db.select().from(feedback).where(eq(feedback.userId, locals.user.id))
  };
  return json(body, {
    headers: { 'Content-Disposition': 'attachment; filename="my-data-magyarul-nyolc-cc.json"' }
  });
};
