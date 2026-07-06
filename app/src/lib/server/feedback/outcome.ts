import { getDb } from '$lib/server/db';
import { feedback, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Outcome notification adapter (SP6). Real sender: SMTP via A2 Hosting
 * (noreply@nyolc.cc mailbox; SPF/DKIM/DMARC live on nyolc.cc, 2026-07-06).
 * Without SMTP_PASS in env it degrades to log-only — visible, never silent.
 */
import nodemailer from 'nodemailer';

export async function sendOutcomeEmail(to: string, subject: string, body: string) {
  const pass = process.env.SMTP_PASS;
  if (!pass) {
    console.info(`[outcome-email:log-only] to=${to} subject="${subject}"\n${body}`);
    return { sent: false as const };
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.nyolc.cc',
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user: process.env.SMTP_USER || 'noreply@nyolc.cc', pass }
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'Magyarul <noreply@nyolc.cc>',
    to,
    subject,
    text: body
  });
  return { sent: true as const };
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
