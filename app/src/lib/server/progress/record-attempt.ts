import { getDb } from '$lib/server/db';
import {
  exercises,
  exerciseProgress,
  lessonProgress,
  exerciseSrsItems,
  lessons,
  userSrsState
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { AnswerClass } from '$lib/engine/validate';
import { sm2, qualityFor, nextDue, type SrsState } from '$lib/engine/sm2';

const RANK: Record<AnswerClass, number> = { wrong: 0, accent: 1, correct: 2 };

/**
 * Record one attempt: aggregate exercise progress (first_result immutable),
 * recompute lesson completion, and advance SM-2 state for linked SRS items.
 */
export async function recordAttempt(userId: string, exerciseId: string, result: AnswerClass) {
  const db = getDb();
  const ex = (await db.select().from(exercises).where(eq(exercises.id, exerciseId)))[0];
  if (!ex) throw new Error(`unknown exercise ${exerciseId}`);

  await db.transaction(async (tx) => {
    // -- exercise aggregate --------------------------------------------------
    const existing = (
      await tx
        .select()
        .from(exerciseProgress)
        .where(and(eq(exerciseProgress.userId, userId), eq(exerciseProgress.exerciseId, exerciseId)))
    )[0];
    if (existing) {
      const best = RANK[result] > RANK[existing.bestResult] ? result : existing.bestResult;
      await tx
        .update(exerciseProgress)
        .set({ bestResult: best, attempts: existing.attempts + 1, lastAttemptAt: new Date() })
        .where(and(eq(exerciseProgress.userId, userId), eq(exerciseProgress.exerciseId, exerciseId)));
    } else {
      await tx.insert(exerciseProgress).values({
        userId,
        exerciseId,
        firstResult: result,
        bestResult: result
      });
    }

    // -- lesson recompute (lesson exercises only; assessment attempts skip) ---
    if (!ex.lessonId) return;
    const lessonExercises = await tx
      .select({ id: exercises.id })
      .from(exercises)
      .where(eq(exercises.lessonId, ex.lessonId!));
    const attempted = await tx
      .select({ id: exerciseProgress.exerciseId, first: exerciseProgress.firstResult })
      .from(exerciseProgress)
      .innerJoin(exercises, eq(exercises.id, exerciseProgress.exerciseId))
      .where(and(eq(exerciseProgress.userId, userId), eq(exercises.lessonId, ex.lessonId!)));
    const complete = attempted.length >= lessonExercises.length;
    const firstAccuracy =
      attempted.length > 0 ? attempted.filter((a) => a.first === 'correct').length / attempted.length : null;

    await tx
      .insert(lessonProgress)
      .values({
        userId,
        lessonId: ex.lessonId!,
        status: complete ? 'completed' : 'in_progress',
        firstAccuracy,
        lastVisitedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: {
          status: complete ? 'completed' : 'in_progress',
          firstAccuracy,
          lastVisitedAt: new Date()
        }
      });

    // -- SRS advance -----------------------------------------------------------
    const lesson = (await tx.select().from(lessons).where(eq(lessons.id, ex.lessonId!)))[0];
    const skill = lesson.skillTags[0] ?? 'reading';
    const modality = 'text';
    const direction = ex.type === 'card_flip' ? 'recognition' : 'production';
    const quality = qualityFor(result, ex.type === 'card_flip');

    const linked = await tx
      .select({ srsItemId: exerciseSrsItems.srsItemId })
      .from(exerciseSrsItems)
      .where(eq(exerciseSrsItems.exerciseId, exerciseId));

    for (const { srsItemId } of linked) {
      const key = and(
        eq(userSrsState.userId, userId),
        eq(userSrsState.srsItemId, srsItemId),
        eq(userSrsState.skill, skill),
        eq(userSrsState.modality, modality),
        eq(userSrsState.direction, direction)
      );
      const prevRow = (await tx.select().from(userSrsState).where(key))[0];
      const prev: SrsState = prevRow
        ? { ease: prevRow.ease, intervalDays: prevRow.intervalDays, reps: prevRow.reps, lapses: prevRow.lapses }
        : { ease: 2.5, intervalDays: 0, reps: 0, lapses: 0 };
      const next = sm2(prev, quality);
      const due = nextDue(new Date(), next.intervalDays);
      if (prevRow) {
        await tx
          .update(userSrsState)
          .set({ ease: next.ease, intervalDays: next.intervalDays, reps: next.reps, lapses: next.lapses, dueAt: due })
          .where(key);
      } else {
        await tx.insert(userSrsState).values({
          userId,
          srsItemId,
          skill,
          modality,
          direction,
          ease: next.ease,
          intervalDays: next.intervalDays,
          reps: next.reps,
          lapses: next.lapses,
          dueAt: due
        });
      }
    }
  });
}

/** Touch last-visited (lesson page load). */
export async function touchLesson(userId: string, lessonId: string) {
  const db = getDb();
  await db
    .insert(lessonProgress)
    .values({ userId, lessonId, lastVisitedAt: new Date() })
    .onConflictDoUpdate({
      target: [lessonProgress.userId, lessonProgress.lessonId],
      set: { lastVisitedAt: new Date() }
    });
}

export async function dueSrsItems(userId: string) {
  const db = getDb();
  return db.execute(sql`
    SELECT s.user_id, s.srs_item_id, s.skill, s.modality, s.direction, i.payload
    FROM user_srs_state s JOIN srs_items i ON i.id = s.srs_item_id
    WHERE s.user_id = ${userId} AND s.due_at <= now()
    ORDER BY s.due_at ASC LIMIT 20`);
}
