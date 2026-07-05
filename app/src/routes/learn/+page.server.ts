import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { modules, lessons, lessonProgress, assessments } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  const db = getDb();
  const progress = locals.user
    ? await db
        .select({ lessonId: lessonProgress.lessonId, status: lessonProgress.status })
        .from(lessonProgress)
        .where(eq(lessonProgress.userId, locals.user.id))
    : [];
  const progressById = new Map(progress.map((p) => [p.lessonId, p.status]));
  const mods = await db.select().from(modules).orderBy(asc(modules.tier), asc(modules.position));
  const lessRows = await db
    .select({
      id: lessons.id,
      moduleId: lessons.moduleId,
      title: lessons.title,
      position: lessons.position,
      status: lessons.status,
      estimatedMinutes: lessons.estimatedMinutes
    })
    .from(lessons)
    .orderBy(asc(lessons.position));
  const less = lessRows.map((l) => ({ ...l, progress: progressById.get(l.id) ?? null }));

  const assessRows = await db
    .select({ id: assessments.id, tier: assessments.tier })
    .from(assessments);

  // Group: tier -> modules -> lessons. Tiers with no modules simply don't
  // appear (C1/C2 stay invisible until content exists).
  const tiers: { tier: string; assessmentId: string | null; modules: { id: string; title: string; description: string | null; lessons: typeof less }[] }[] = [];
  for (const m of mods) {
    let tier = tiers.find((t) => t.tier === m.tier);
    if (!tier) {
      tier = { tier: m.tier, assessmentId: assessRows.find((a) => a.tier === m.tier)?.id ?? null, modules: [] };
      tiers.push(tier);
    }
    tier.modules.push({
      id: m.id,
      title: m.title,
      description: m.description,
      lessons: less.filter((l) => l.moduleId === m.id)
    });
  }
  return { tiers };
};
