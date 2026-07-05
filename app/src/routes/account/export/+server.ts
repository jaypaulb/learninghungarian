import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GDPR data portability: everything we hold about the requesting user,
 * as a JSON download. Later plans (progress, SRS, feedback) append their
 * sections here — this endpoint is THE canonical exporter.
 */
export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) throw error(401, 'Not signed in');
  const body = {
    exportedAt: new Date().toISOString(),
    user: locals.user
  };
  return json(body, {
    headers: { 'Content-Disposition': 'attachment; filename="my-data-magyarul-nyolc-cc.json"' }
  });
};
