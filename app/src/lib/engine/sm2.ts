/**
 * SM-2 spaced-repetition scheduler (pure). Quality 0-5; below 3 is a lapse.
 * Answer-class mapping lives beside it so the whole pipeline is testable.
 */
import type { AnswerClass } from './validate';

export interface SrsState {
  ease: number; // ease factor, floor 1.3
  intervalDays: number;
  reps: number; // consecutive successful reviews
  lapses: number;
}

export const INITIAL_SRS: SrsState = { ease: 2.5, intervalDays: 0, reps: 0, lapses: 0 };

export function qualityFor(result: AnswerClass, selfGraded = false): number {
  if (result === 'correct') return selfGraded ? 4 : 5;
  if (result === 'accent') return 3;
  return 1;
}

export function sm2(prev: SrsState, quality: number): SrsState {
  const q = Math.max(0, Math.min(5, quality));
  if (q < 3) {
    return {
      ease: Math.max(1.3, prev.ease - 0.2),
      intervalDays: 0, // due again now (relearn)
      reps: 0,
      lapses: prev.lapses + 1
    };
  }
  const ease = Math.max(1.3, prev.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  const reps = prev.reps + 1;
  const intervalDays = reps === 1 ? 1 : reps === 2 ? 6 : Math.round(prev.intervalDays * ease * 10) / 10;
  return { ease, intervalDays, reps, lapses: prev.lapses };
}

export function nextDue(from: Date, intervalDays: number): Date {
  return new Date(from.getTime() + intervalDays * 24 * 60 * 60 * 1000);
}
