import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { lessonProgress, lessons, userSrsState } from '$lib/server/db/schema';
import { eq, desc, and, lte, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) return { user: null, momentum: null };
  const db = getDb();

  const [latest] = await db
    .select({ lessonId: lessonProgress.lessonId, status: lessonProgress.status, title: lessons.title })
    .from(lessonProgress)
    .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
    .where(eq(lessonProgress.userId, locals.user.id))
    .orderBy(desc(lessonProgress.lastVisitedAt))
    .limit(1);

  const [{ completed }] = await db
    .select({ completed: sql<number>`count(*)` })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, locals.user.id), eq(lessonProgress.status, 'completed')));

  const [{ total }] = await db.select({ total: sql<number>`count(*)` }).from(lessons);

  const [{ due }] = await db
    .select({ due: sql<number>`count(*)` })
    .from(userSrsState)
    .where(and(eq(userSrsState.userId, locals.user.id), lte(userSrsState.dueAt, new Date())));

  // Next lesson: latest in-progress one, or the first not-yet-completed lesson.
  let next: { id: string; title: string } | null = null;
  if (latest && latest.status === 'in_progress') {
    next = { id: latest.lessonId, title: latest.title };
  } else {
    const [firstOpen] = await db
      .select({ id: lessons.id, title: lessons.title })
      .from(lessons)
      .where(
        sql`${lessons.id} NOT IN (SELECT lesson_id FROM lesson_progress WHERE user_id = ${locals.user.id} AND status = 'completed')`
      )
      .orderBy(lessons.position)
      .limit(1);
    if (firstOpen) next = firstOpen;
  }

  return {
    user: { email: locals.user.email },
    momentum: {
      next,
      started: Boolean(latest),
      completed: Number(completed),
      total: Number(total),
      due: Number(due)
    }
  };
};
