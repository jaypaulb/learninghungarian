import { describe, it, expect } from 'vitest';
// plain-JS module shared with the scripts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { audioId, audioUrlFor, collectAudioStrings } from '../../../../scripts/audio-lib.mjs';

describe('audio pipeline', () => {
  it('audioId is deterministic and voice-scoped', () => {
    expect(audioId('szia')).toBe(audioId('  szia ')); // trimmed
    expect(audioId('szia')).not.toBe(audioId('szió'));
    expect(audioUrlFor('szia')).toBe(`/audio/${audioId('szia')}.mp3`);
  });

  it('collects Hungarian strings only: examples, vocab fronts, card fronts, listening audioText', () => {
    const texts = collectAudioStrings('content');
    expect(texts).toContain('nyolc'); // vocab front + listening
    expect(texts).toContain('Szia! Anna vagyok. Angol vagyok, és tanár vagyok.'); // example
    expect(texts).toContain('a házban'); // listening audioText
    // grammar fronts are English prompts — never synthesized
    expect(texts.find((t: string) => t.includes('How many?'))).toBeUndefined();
    expect(texts.find((t: string) => t.includes('in the house /'))).toBeUndefined();
  });

  it('every collected string has a generated file in the manifest', async () => {
    const { readFileSync } = await import('node:fs');
    const manifest = JSON.parse(readFileSync('static/audio/manifest.json', 'utf8'));
    for (const text of collectAudioStrings('content')) {
      expect(manifest[text], `missing audio for "${text}"`).toBeDefined();
    }
  });
});
