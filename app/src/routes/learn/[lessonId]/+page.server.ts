import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { lessons, contentBlocks, exercises } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
  const db = getDb();
  const lesson = (await db.select().from(lessons).where(eq(lessons.id, params.lessonId)))[0];
  if (!lesson) throw error(404, 'Lesson not found');

  const blocks = await db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.lessonId, lesson.id))
    .orderBy(asc(contentBlocks.position));

  const exs = await db
    .select({ id: exercises.id, type: exercises.type, payload: exercises.payload })
    .from(exercises)
    .where(eq(exercises.lessonId, lesson.id))
    .orderBy(asc(exercises.position));

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      objectives: lesson.objectives,
      status: lesson.status,
      sources: lesson.sources
    },
    blocks,
    exercises: exs
  };
};
