import { json } from '@sveltejs/kit';
import { checkDbConnection } from '$lib/server/db';

export async function GET() {
  const dbOk = await checkDbConnection();
  return json(
    { status: dbOk ? 'ok' : 'degraded', db: dbOk ? 'ok' : 'down' },
    { status: dbOk ? 200 : 503 }
  );
}
