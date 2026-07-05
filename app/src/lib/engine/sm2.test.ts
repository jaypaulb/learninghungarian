import { describe, it, expect } from 'vitest';
import { sm2, qualityFor, INITIAL_SRS, nextDue } from './sm2';

describe('qualityFor', () => {
  it('maps answer classes', () => {
    expect(qualityFor('correct')).toBe(5);
    expect(qualityFor('correct', true)).toBe(4); // self-graded card flip
    expect(qualityFor('accent')).toBe(3);
    expect(qualityFor('wrong')).toBe(1);
  });
});

describe('sm2', () => {
  it('first success schedules 1 day, second 6 days', () => {
    const s1 = sm2(INITIAL_SRS, 5);
    expect(s1.intervalDays).toBe(1);
    expect(s1.reps).toBe(1);
    const s2 = sm2(s1, 5);
    expect(s2.intervalDays).toBe(6);
  });

  it('repeated success grows the interval multiplicatively', () => {
    let s = sm2(sm2(INITIAL_SRS, 5), 5); // 6 days
    const s3 = sm2(s, 5);
    expect(s3.intervalDays).toBeGreaterThan(6 * 2); // ease ~2.6
  });

  it('failure resets reps and interval, counts a lapse, drops ease', () => {
    const grown = sm2(sm2(INITIAL_SRS, 5), 5);
    const failed = sm2(grown, 1);
    expect(failed.intervalDays).toBe(0);
    expect(failed.reps).toBe(0);
    expect(failed.lapses).toBe(1);
    expect(failed.ease).toBeLessThan(grown.ease);
  });

  it('ease never drops below 1.3', () => {
    let s = INITIAL_SRS;
    for (let i = 0; i < 20; i++) s = sm2(s, 0);
    expect(s.ease).toBe(1.3);
  });

  it('accent-quality (3) succeeds but slows ease growth', () => {
    const s = sm2(INITIAL_SRS, 3);
    expect(s.reps).toBe(1);
    expect(s.ease).toBeLessThan(2.5);
  });

  it('nextDue adds interval days', () => {
    const from = new Date('2026-07-05T00:00:00Z');
    expect(nextDue(from, 6).toISOString()).toBe('2026-07-11T00:00:00.000Z');
  });
});
