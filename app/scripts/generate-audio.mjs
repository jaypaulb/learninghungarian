// Pre-generate Hungarian TTS for all content strings (authoring-time tool).
//   npm run audio:generate
// Requires: piper (with hu_HU voice model) + ffmpeg on PATH.
// Idempotent: existing files are skipped; manifest.json maps text -> file.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir, tmpdir } from 'node:os';
import { collectAudioStrings, audioId, VOICE } from './audio-lib.mjs';

const CONTENT_DIR = process.env.CONTENT_DIR ?? 'content';
const OUT_DIR = 'static/audio';
const PIPER = process.env.PIPER_BIN ?? join(homedir(), '.local/bin/piper');
const MODEL = process.env.PIPER_MODEL ?? join(homedir(), '.local/share/piper-voices', `${VOICE}.onnx`);

mkdirSync(OUT_DIR, { recursive: true });
const texts = collectAudioStrings(CONTENT_DIR);
const manifest = {};
let generated = 0;

for (const text of texts) {
  const id = audioId(text);
  const mp3 = join(OUT_DIR, `${id}.mp3`);
  manifest[text] = `${id}.mp3`;
  if (existsSync(mp3)) continue;
  const wav = join(tmpdir(), `${id}.wav`);
  execFileSync(PIPER, ['-m', MODEL, '-f', wav], { input: text });
  // 300ms leading + 200ms trailing silence: Bluetooth/HDMI sinks swallow the
  // start of very short clips while waking up (field finding, 2026-07-05).
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', wav,
    '-af', 'adelay=300:all=1,apad=pad_dur=0.2',
    '-codec:a', 'libmp3lame', '-qscale:a', '6', mp3
  ]);
  generated++;
  console.log(`  + ${id}.mp3  "${text}"`);
}

writeFileSync(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Audio OK: ${texts.length} strings, ${generated} newly generated, voice ${VOICE}.`);
