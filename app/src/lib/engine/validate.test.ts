import { describe, it, expect } from 'vitest';
import { classifyAnswer, classifySequence, normalize, stripDiacritics } from './validate';

describe('normalize', () => {
  it('trims, lowercases, collapses whitespace', () => {
    expect(normalize('  Szia   Világ  ')).toBe('szia világ');
  });
  it('ignores trailing sentence punctuation', () => {
    expect(normalize('Ők tanárok.')).toBe('ők tanárok');
    expect(normalize('Hol vagy?')).toBe('hol vagy');
  });
});

describe('stripDiacritics', () => {
  it('maps all nine Hungarian diacritics', () => {
    expect(stripDiacritics('áéíóöőúüű')).toBe('aeiooouuu');
  });
  it('leaves plain ascii alone', () => {
    expect(stripDiacritics('szia')).toBe('szia');
  });
});

describe('classifyAnswer', () => {
  it('exact match is correct', () => {
    expect(classifyAnswer('vagyok', 'vagyok')).toBe('correct');
  });
  it('case and whitespace differences are still correct', () => {
    expect(classifyAnswer('  Vagyok ', 'vagyok')).toBe('correct');
    expect(classifyAnswer('jó  napot', 'Jó napot')).toBe('correct');
  });
  it('accented answer typed without accents is accent-class', () => {
    expect(classifyAnswer('jo napot', 'jó napot')).toBe('accent');
    expect(classifyAnswer('szo', 'szó')).toBe('accent');
    expect(classifyAnswer('bunos', 'bűnös')).toBe('accent');
  });
  it('wrong diacritic (but right base word) is accent-class', () => {
    expect(classifyAnswer('szö', 'szó')).toBe('accent');
    expect(classifyAnswer('búnös', 'bűnös')).toBe('accent');
  });
  it('per-letter coverage: each diacritic degrades to accent, not wrong', () => {
    const pairs: Array<[string, string]> = [
      ['almafa', 'álmafa'],
      ['elet', 'élet'],
      ['iras', 'írás'],
      ['ora', 'óra'],
      ['ot', 'öt'],
      ['ot', 'őt'],
      ['ut', 'út'],
      ['ules', 'ülés'],
      ['tuz', 'tűz']
    ];
    for (const [input, expected] of pairs) {
      expect(classifyAnswer(input, expected), `${input} vs ${expected}`).toBe('accent');
    }
  });
  it('different word is wrong', () => {
    expect(classifyAnswer('vagy', 'vagyok')).toBe('wrong');
    expect(classifyAnswer('', 'vagyok')).toBe('wrong');
    expect(classifyAnswer('kutya', 'macska')).toBe('wrong');
  });
  it('accent-stripped collision still counts as accent (ot/öt/őt)', () => {
    expect(classifyAnswer('öt', 'őt')).toBe('accent');
  });
});

describe('classifySequence', () => {
  it('correct order is correct', () => {
    expect(classifySequence(['Én', 'tanár', 'vagyok'], 'én tanár vagyok')).toBe('correct');
  });
  it('wrong order is wrong', () => {
    expect(classifySequence(['tanár', 'én', 'vagyok'], 'én tanár vagyok')).toBe('wrong');
  });
  it('missing accents in tiles degrade to accent-class', () => {
    expect(classifySequence(['en', 'tanar', 'vagyok'], 'én tanár vagyok')).toBe('accent');
  });
});
