import { getDb } from '$lib/server/db';
import { feedback, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Outcome notification adapter (SP6). Provider decision (transactional email
 * for noreply@nyolc.cc) is deliberately NOT made autonomously — the default
 * sender LOGS the message it would send. Swapping in a real provider later
 * only touches sendOutcomeEmail.
 */
async function sendOutcomeEmail(to: string, subject: string, body: string) {
  console.info(`[outcome-email:log-only] to=${to} subject="${subject}"\n${body}`);
}

export async function resolveFeedback(
  feedbackId: string,
  decision: 'accepted' | 'rejected',
  note: string
) {
  const db = getDb();
  const row = (await db.select().from(feedback).where(eq(feedback.id, feedbackId)))[0];
  if (!row) throw new Error('no such feedback');
  await db.update(feedback).set({ status: decision }).where(eq(feedback.id, feedbackId));

  if (row.consentContact === 1) {
    const user = (await db.select().from(users).where(eq(users.id, row.userId)))[0];
    if (user) {
      const outcome =
        decision === 'accepted'
          ? 'we agreed and the fix is on its way into the course'
          : 'after review we decided to keep the current version';
      await sendOutcomeEmail(
        user.email,
        'Your magyarul.nyolc.cc suggestion — outcome',
        `Köszönjük! You suggested:\n\n> ${row.message}\n\nOutcome: ${outcome}.\n${note ? `Note: ${note}\n` : ''}\nEvery suggestion makes the course better — thank you.`
      );
    }
  }
  return { notified: row.consentContact === 1 };
}
