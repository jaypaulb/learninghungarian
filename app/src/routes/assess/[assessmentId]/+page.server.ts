import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { assessments, exercises } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
  const db = getDb();
  const assessment = (
    await db.select().from(assessments).where(eq(assessments.id, params.assessmentId))
  )[0];
  if (!assessment) throw error(404, 'Assessment not found');

  const exs = await db
    .select({ id: exercises.id, type: exercises.type, payload: exercises.payload })
    .from(exercises)
    .where(eq(exercises.assessmentId, assessment.id))
    .orderBy(asc(exercises.position));

  return {
    assessment: { id: assessment.id, tier: assessment.tier, title: assessment.title, description: assessment.description },
    exercises: exs
  };
};
