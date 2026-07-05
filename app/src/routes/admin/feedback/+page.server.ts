import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/server/db';
import { feedback, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { resolveFeedback } from '$lib/server/feedback/outcome';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'jaypaulb@gmail.com')
  .split(',')
  .map((s) => s.trim().toLowerCase());

function requireAdmin(user: { email: string } | null) {
  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    throw error(403, 'Admins only');
  }
}

export const load: PageServerLoad = async ({ locals }) => {
  requireAdmin(locals.user);
  const rows = await getDb()
    .select({
      id: feedback.id,
      lessonId: feedback.lessonId,
      exerciseId: feedback.exerciseId,
      contentVersion: feedback.contentVersion,
      message: feedback.message,
      consent: feedback.consentContact,
      status: feedback.status,
      githubIssue: feedback.githubIssue,
      createdAt: feedback.createdAt,
      email: users.email
    })
    .from(feedback)
    .leftJoin(users, eq(users.id, feedback.userId))
    .orderBy(desc(feedback.createdAt))
    .limit(100);
  return { rows: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })) };
};

export const actions: Actions = {
  resolve: async ({ locals, request }) => {
    requireAdmin(locals.user);
    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    const decision = String(form.get('decision') ?? '');
    if (!id || (decision !== 'accepted' && decision !== 'rejected')) throw error(400, 'bad form');
    await resolveFeedback(id, decision, String(form.get('note') ?? ''));
    throw redirect(303, '/admin/feedback');
  }
};
