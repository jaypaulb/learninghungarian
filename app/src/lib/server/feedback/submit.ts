import { getDb } from '$lib/server/db';
import { feedback, lessons } from '$lib/server/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

const MAX_LENGTH = 2000;
const MAX_PER_HOUR = 5;

export class FeedbackError extends Error {
  constructor(
    public code: 'rate_limited' | 'invalid',
    message: string
  ) {
    super(message);
  }
}

/**
 * Store feedback privately, then (best-effort) open a PII-free GitHub issue
 * carrying ONLY the row UUID + content refs. Message text never leaves the
 * DB — the SP6 processing agent reads it there (prompt-injection containment).
 */
export async function submitFeedback(opts: {
  userId: string;
  lessonId?: string;
  exerciseId?: string;
  message: string;
  consentContact: boolean;
}) {
  const message = opts.message.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').trim();
  if (!message || message.length > MAX_LENGTH) {
    throw new FeedbackError('invalid', `message must be 1-${MAX_LENGTH} chars`);
  }

  const db = getDb();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await db
    .select({ n: sql<number>`count(*)` })
    .from(feedback)
    .where(and(eq(feedback.userId, opts.userId), gte(feedback.createdAt, hourAgo)));
  if (Number(recent[0].n) >= MAX_PER_HOUR) {
    throw new FeedbackError('rate_limited', 'too many submissions — try again in an hour');
  }

  let contentVersion: number | null = null;
  if (opts.lessonId) {
    const lesson = (await db.select().from(lessons).where(eq(lessons.id, opts.lessonId)))[0];
    contentVersion = lesson?.contentVersion ?? null;
  }

  const row = (
    await db
      .insert(feedback)
      .values({
        userId: opts.userId,
        lessonId: opts.lessonId ?? null,
        exerciseId: opts.exerciseId ?? null,
        contentVersion,
        message,
        consentContact: opts.consentContact ? 1 : 0
      })
      .returning()
  )[0];

  const issueNumber = await createGithubIssue(row.id, opts.lessonId, opts.exerciseId);
  if (issueNumber) {
    await db.update(feedback).set({ githubIssue: issueNumber }).where(eq(feedback.id, row.id));
  }
  return { id: row.id, githubIssue: issueNumber };
}

/** PII-free by construction: UUID + slugs only. Returns null when disabled. */
async function createGithubIssue(
  feedbackId: string,
  lessonId?: string,
  exerciseId?: string
): Promise<number | null> {
  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  const repo = process.env.GITHUB_FEEDBACK_REPO ?? 'jaypaulb/learninghungarian';
  if (!token) {
    console.warn(`feedback ${feedbackId}: GITHUB_FEEDBACK_TOKEN not set — issue creation skipped`);
    return null;
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `feedback: ${lessonId ?? exerciseId ?? 'general'} (${feedbackId.slice(0, 8)})`,
        body: [
          `Feedback record: \`${feedbackId}\``,
          lessonId ? `Lesson: \`${lessonId}\`` : null,
          exerciseId ? `Exercise: \`${exerciseId}\`` : null,
          '',
          '_Message text is stored privately; the triage agent reads it from the database._'
        ]
          .filter(Boolean)
          .join('\n'),
        labels: ['feedback', 'needs-assessment']
      })
    });
    if (!res.ok) {
      console.error(`feedback ${feedbackId}: GitHub issue creation failed HTTP ${res.status}`);
      return null;
    }
    return (await res.json()).number as number;
  } catch (e) {
    console.error(`feedback ${feedbackId}: GitHub issue creation error`, e);
    return null;
  }
}
