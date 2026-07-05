import { chat, type ChatMessage, type ChatResult } from './provider';
import { getDb } from '$lib/server/db';
import { lessonProgress, lessons } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const SYSTEM_PROMPT = `You are a friendly, precise Hungarian tutor on magyarul.nyolc.cc,
helping an English speaker work from zero toward the B2 residency exam.

Rules:
- Match the learner's level (given below). At A1-A2, scaffold heavily in English
  and keep Hungarian examples short. From B1, use progressively more Hungarian.
- When correcting, show: what they wrote -> corrected version -> ONE key reason.
  Prefer the single most important correction over listing everything.
- Always mark vowel-harmony and definite/indefinite conjugation issues explicitly —
  these are the core Hungarian difficulties for English speakers.
- If you are not certain about a Hungarian form, say so plainly rather than guess.
- Keep replies under 200 words unless asked to elaborate.`;

export async function tutorReply(
  userId: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<ChatResult> {
  // Level estimate from progress: highest tier with any completed lesson.
  const db = getDb();
  const completed = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId));
  const level = completed.length > 3 ? 'A1 (finishing)' : 'A1 (beginner)'; // refined as tiers grow

  const messages: ChatMessage[] = [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\nLearner level: ${level}.` },
    ...history.slice(-12) // bound context
  ];
  return chat(messages);
}
