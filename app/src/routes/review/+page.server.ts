import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dueSrsItems } from '$lib/server/progress/record-attempt';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const due = await dueSrsItems(locals.user.id);
  return {
    due: due.rows.map((r) => ({
      srsItemId: r.srs_item_id as string,
      skill: r.skill as string,
      direction: r.direction as string,
      payload: r.payload as { front: string; back: string }
    }))
  };
};
