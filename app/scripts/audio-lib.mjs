// Shared audio-pipeline helpers: string discovery + deterministic URLs.
// Used by generate-audio.mjs (synthesis) and import-content.js (enrichment).
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export const VOICE = 'hu_HU-anna-medium';

/** @param {string} text */
export function audioId(text) {
  return createHash('sha1').update(`${VOICE}:${text.trim()}`).digest('hex').slice(0, 20);
}

/** @param {string} text */
export function audioUrlFor(text) {
  return `/audio/${audioId(text)}.mp3`;
}

/** Every Hungarian string in the content tree that needs audio. */
/** @param {string} contentDir */
export function collectAudioStrings(contentDir) {
  const texts = new Set();
  /** @param {any} doc */
  const addFromLesson = (doc) => {
    for (const b of doc.blocks ?? []) {
      if (b.type === 'example' && b.payload?.hungarian) texts.add(b.payload.hungarian.trim());
    }
    for (const s of doc.srsItems ?? []) {
      // Only vocab fronts are Hungarian; grammar fronts are English prompts.
      if (s.id?.startsWith('vocab:') && s.payload?.front) texts.add(s.payload.front.trim());
    }
    for (const ex of doc.exercises ?? []) {
      if (ex.type === 'card_flip' && ex.payload?.front) texts.add(ex.payload.front.trim());
      if (ex.type === 'listening' && ex.payload?.audioText) texts.add(ex.payload.audioText.trim());
      if (ex.type === 'speaking' && ex.payload?.promptText) texts.add(ex.payload.promptText.trim());
    }
  };
  for (const tierDir of readdirSync(contentDir).sort()) {
    const tierPath = join(contentDir, tierDir);
    if (!statSync(tierPath).isDirectory()) continue;
    try {
      addFromLesson(parse(readFileSync(join(tierPath, '_assessment.yaml'), 'utf8')));
    } catch (e) {
      if (/** @type {NodeJS.ErrnoException} */ (e).code !== 'ENOENT') throw e;
    }
    for (const modDir of readdirSync(tierPath).sort()) {
      const modPath = join(tierPath, modDir);
      if (!statSync(modPath).isDirectory()) continue;
      for (const f of readdirSync(modPath).sort()) {
        if (!f.endsWith('.yaml') || f === '_module.yaml') continue;
        addFromLesson(parse(readFileSync(join(modPath, f), 'utf8')));
      }
    }
  }
  return [...texts].sort();
}
