import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { deleteUserById } from '$lib/server/auth/user-repo';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const { id, email, displayName, createdAt } = locals.user;
  return { user: { id, email, displayName, createdAt: createdAt.toISOString() } };
};

export const actions: Actions = {
  // GDPR right to erasure. With trusted-header identity a fresh row is
  // provisioned on the next authenticated visit — documented behavior.
  delete: async ({ locals }) => {
    if (!locals.user) throw error(401, 'Not signed in');
    await deleteUserById(locals.user.id);
    throw redirect(303, '/');
  }
};
