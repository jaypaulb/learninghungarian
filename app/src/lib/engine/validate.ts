/**
 * Accent-aware answer validation (spec §5). Pure and client-safe.
 *
 * 'correct' — matches after normalization (trim/lowercase/whitespace)
 * 'accent'  — right word, wrong/missing Hungarian diacritics
 * 'wrong'   — anything else
 */
export type AnswerClass = 'correct' | 'accent' | 'wrong';

const DIACRITIC_MAP: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ö: 'o',
  ő: 'o',
  ú: 'u',
  ü: 'u',
  ű: 'u'
};

export function normalize(s: string): string {
  // Trailing sentence punctuation must never fail a learner ("Ők tanárok."
  // vs "Ők tanárok" — MoE review finding).
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/, '');
}

export function stripDiacritics(s: string): string {
  return s.replace(/[áéíóöőúüű]/g, (c) => DIACRITIC_MAP[c]);
}

export function classifyAnswer(input: string, expected: string): AnswerClass {
  const a = normalize(input);
  const b = normalize(expected);
  if (a === b) return 'correct';
  if (stripDiacritics(a) === stripDiacritics(b)) return 'accent';
  return 'wrong';
}

/** Word-order check for sentence building: exact sequence after normalize. */
export function classifySequence(words: string[], expected: string): AnswerClass {
  return classifyAnswer(words.join(' '), expected);
}

export const FEEDBACK: Record<AnswerClass, string> = {
  correct: '✔️ Correct!',
  accent: '🔶 Right word — check the accents!',
  wrong: '✖️ Not quite — try again.'
};
