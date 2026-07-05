# SP3a — Audio Layer: TTS + Listening (speaking/Whisper = SP3b)

**Goal:** Sound everywhere it teaches: pre-generated Hungarian TTS on vocab,
examples, and a new `listening` exercise type. Speaking assessment (Whisper on
HAL's GPU + feedback) is SP3b.

## Decisions

- **TTS engine: Piper** (self-hosted neural, `hu_HU-anna-medium`) — zero
  recurring cost, no API keys, aligns with free-forever. Verified working
  locally (63MB onnx voice).
- **Pre-generation at authoring time**: `npm run audio:generate` scans content
  YAML for Hungarian strings (example blocks, card fronts, srs item fronts,
  listening `audioText`), synthesizes WAV via piper, encodes MP3 via ffmpeg,
  writes `app/static/audio/<sha1(text)>.mp3` + manifest. Idempotent (skips
  existing). Files are committed; the image ships them as static assets.
- **URL resolution at import time**: the importer computes `audioUrl` from the
  same sha1 and injects it into stored payloads (card_flip front, listening
  audioText, example blocks, srs items). Client components stay dumb: render
  a player iff `audioUrl` present. Import **fails** if a referenced audio file
  is missing from the manifest (no silent 404s).
- **`listening` exercise type**: payload `{ audioText, mode: transcribe|meaning,
  answer? (transcribe, accent-aware), options?+correctIndex? (meaning),
  translation?, hint? }`. The learner hears — never sees — `audioText`.

## Tasks
1. Schema: `listening` payload + conditional validation; importer audio
   enrichment + missing-file guard
2. `generate-audio.mjs` pipeline (piper→ffmpeg→static/audio + manifest)
3. Components: `AudioButton` (examples, card fronts, review cards) +
   `Listening` exercise component
4. Content: listening exercises added to the four A1 lessons (reusing
   MoE-validated strings), skills tags gain `listening`, versions bumped
5. Full verify (unit + e2e incl. listening flow) → deploy → live check

## DoD
- [ ] Audio generated for every referenced Hungarian string; import fails on gaps
- [ ] Listening exercises validate accent-aware (transcribe) and by option (meaning)
- [ ] 🔊 on examples, flashcards, review cards; lesson audio works on production
