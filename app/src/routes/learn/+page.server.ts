import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { modules, lessons } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
  const db = getDb();
  const mods = await db.select().from(modules).orderBy(asc(modules.tier), asc(modules.position));
  const less = await db
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

  // Group: tier -> modules -> lessons. Tiers with no modules simply don't
  // appear (C1/C2 stay invisible until content exists).
  const tiers: { tier: string; modules: { id: string; title: string; description: string | null; lessons: typeof less }[] }[] = [];
  for (const m of mods) {
    let tier = tiers.find((t) => t.tier === m.tier);
    if (!tier) {
      tier = { tier: m.tier, modules: [] };
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
