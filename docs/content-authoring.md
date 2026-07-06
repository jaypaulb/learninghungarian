# Content Authoring Guide — magyarul.nyolc.cc

How to create lessons, exercises, and assessments for the platform. This is
the distilled experience of authoring the first 17 lessons (A1 complete + A2
started), including everything the MoE reviews and production caught.

## The pipeline at a glance

```
YAML in app/content/  ──►  npm run audio:generate  ──►  npm run content:import
      │                        (Piper TTS → MP3)          (validate + upsert to Postgres)
      ▼
  MoE validation (Codex cross-check)  ──►  status: reviewed  ──►  PR → merge → CI → HAL
```

Content ships **inside the Docker image**. A deploy is atomic: code + schema +
content + audio move together. The importer runs on container start.

## Directory layout

```
app/content/
├── A1/                        # one directory per CEFR tier (A1..C2)
│   ├── _assessment.yaml       # the tier's milestone checkpoint (optional)
│   ├── foundation/            # one directory per module
│   │   ├── _module.yaml       # module metadata
│   │   └── alphabet.yaml      # one file per lesson
│   └── everyday/
└── A2/
```

## Module file (`_module.yaml`)

```yaml
id: a1-foundation        # kebab-case, globally unique, NEVER change (stable ID)
tier: A1                 # must match the directory
title: Foundation
description: One sentence shown on the curriculum page.
position: 0              # order within the tier
```

## Lesson file — the full shape

```yaml
id: a1-greetings         # stable ID — progress/SRS reference it; never rename
title: "Greetings & polite phrases"
version: 1               # bump on ANY content change (drift guard enforces this)
position: 0              # order within the module
status: draft            # draft → reviewed (after MoE) → community_verified
objectives:              # each objective should map to ≥1 exercise
  - Greet people formally and informally
skills: [reading, listening, speaking]   # which of the 4 skills it trains
minutes: 20
prerequisites: [a1-alphabet]             # lesson ids that unlock this one
sources:                 # REQUIRED before status: reviewed — cite real references
  - "Rounds, Carol: Hungarian — An Essential Grammar (Routledge, 2nd ed.), §…"
  - "MagyarOK A1 (Szita/Pelcz), unit 1"
provenance:              # added when MoE validation passes
  authoredBy: "claude-opus-4-8"
  validatedBy: "codex (OpenAI)"
  validatedOn: "2026-07-05"
  moeVerdict: "pass-with-fixes"
blocks: [...]            # teaching content, see below
srsItems: [...]          # spaced-repetition atoms, see below
exercises: [...]         # practice, see below
```

### Blocks (teaching content, rendered in order)

| type | payload | use for |
|---|---|---|
| `prose` | `{ text }` | explanation paragraphs |
| `table` | `{ headers: [], rows: [[]] }` | conjugations, vocab lists, endings |
| `example` | `{ hungarian, english }` | model sentences — **gets a 🔉 audio button automatically** |
| `callout` | `{ text }` | the ONE trap/rule the learner must not miss |

Keep lessons to 3–5 blocks. One callout per lesson beats three.

### SRS items (what the learner will re-see in /review)

```yaml
srsItems:
  - id: "vocab:koszonom"        # vocab:<slug> or grammar:<slug> — globally stable
    payload: { front: "köszönöm", back: "thank you" }
```

- **`vocab:` fronts must be Hungarian** — they get TTS audio and appear on
  review cards. **`grammar:` fronts are English prompts** (no audio is
  generated for them — this is enforced by convention in the audio pipeline).
- Reuse existing item ids across lessons when the word repeats — that's the
  point of stable ids.

### Exercises — the nine types

Every exercise: `id` (kebab, unique within the lesson), `type`, optional
`srs: [item-ids]` (answering updates those items' schedules), `payload`.
All text answers are validated **accent-aware**: right word with wrong/missing
diacritics gets "check your accents", not "wrong". Trailing punctuation and
case are ignored.

| type | payload essentials | notes |
|---|---|---|
| `fill_blank` | `prompt` (with `___`), `answer`, `translation?`, `hint?` | the workhorse |
| `mcq` | `prompt`, `options[]`, `correctIndex` | recognition checks |
| `dropdown` | `prompt` (with `___`), `options[]`, `correct` | binary grammar choices (-ban/-ben) |
| `card_flip` | `front` (Hungarian), `back` | vocabulary; self-graded; gets audio |
| `sentence_build` | `words[]`, `answer`, `translation?` | word order; tiles must join to exactly `answer` — **include punctuation in the tile** (`"vagyok,"`) if the sentence needs it |
| `transform` | `instruction`, `prompt`, `answer`, `translation?` | tense/case/number changes — answer must be the ONLY defensible one |
| `dialogue` | `intro?`, `gaps: [{before, answer, after, translation?}]` | real conversation practice |
| `listening` | `audioText` (Hungarian, **never shown**), `mode: transcribe\|meaning`, `answer` or `options`+`correctIndex` | audio auto-generated from `audioText` |
| `speaking` | `promptText` (shown + model audio), `expected` | **must be a phrase of 2+ words** (schema-enforced — Whisper mangles isolated words) |

## The hard-won rules (each one cost a bug)

1. **Bump `version:` on any content change.** The importer hashes lesson
   content; changed content with an unbumped version fails the import
   (drift guard). This protects learner progress rows keyed to versions.
2. **Speaking prompts are phrases, never single words.** Whisper transcribed
   "nyolc" as "Dolz". Sentences transcribe near-perfectly.
3. **Every Hungarian string that needs audio must be generated before import**
   — run `npm run audio:generate` after adding content; the importer
   hard-fails on missing audio files (no silent dead speaker buttons).
4. **Exact-match traps:** free-response answers (`transform`, `fill_blank`)
   must have exactly one defensible answer. "Answer with the place phrase
   only:" style instructions prevent full-sentence alternatives being marked
   wrong. The MoE review is good at catching these — let it.
5. **Answers with internal commas:** the validator only strips *trailing*
   punctuation. `Nem magyar vagyok, hanem angol` needs the comma in a tile.
6. **Register consistency in dialogues:** don't mix `Jó napot` (formal) with
   `Hogy vagy?` (informal) in one exchange.
7. **`my/your` in possessives:** `bátyám` = *my* brother. Make prompts and
   answers agree in person.
8. **After numbers, singular:** `három ház`, never `három házak`.

## The MoE validation gate (mandatory before `status: reviewed`)

No content reaches learners as `reviewed` on one model's word. The flow:

1. Author with `status: draft` and real `sources:` citations.
2. Run structural validation: `npm run audio:generate && npm run content:import`
   (against the local dev DB — see Workflow below).
3. Cross-validate with Codex:
   ```
   codex exec "<validation prompt naming every file and every grammar claim>" -s read-only
   ```
   Ask it to check: every Hungarian string (spelling incl. diacritics,
   naturalness), every translation, every grammar claim, and **every answer
   key for defensible alternatives**. Demand findings as
   `FILE — SEVERITY — string — problem — correction` + a verdict.
4. Apply every `error`; judge each `questionable` on merits; bump versions.
5. Flip `status: draft` → `reviewed` and add the `provenance:` block.
6. Assessments are held to *higher* scrutiny than lessons — they certify.

The status ladder is honest labeling shown to learners:
`draft` (amber) → `reviewed` = "AI-drafted, provisional" (blue) →
`community_verified` (green, upgraded when crowd corrections confirm it).

## Assessments (`<tier>/_assessment.yaml`)

```yaml
id: a1-assessment
tier: A1
title: "A1 checkpoint — Foundation"
version: 1
exercises: [...]         # same types; 8 items; first attempt counts; 80% passes
```

Cover every module in the tier. No `listening`/`speaking` in checkpoints yet
(keeps them device-independent); revisit when B1/B2 mirror the ECL format.

## Workflow — from idea to production

```bash
git checkout -b feature/content-<batch-name>

# local dev DB
docker run --rm -d --name pg-dev -e POSTGRES_USER=hungarian \
  -e POSTGRES_PASSWORD=hungarian -e POSTGRES_DB=hungarian -p 5433:5432 postgres:16
cd app && export DATABASE_URL=postgres://hungarian:hungarian@localhost:5433/hungarian

# author YAML, then:
npm run audio:generate      # needs piper + the hu_HU voice (see below) + ffmpeg
npm run db:migrate && npm run content:import   # schema-validates everything
npm run test:unit           # includes import idempotency + audio manifest checks

# MoE gate (step 3 above), fix, bump versions, set reviewed

# full check in the real container:
cd .. && docker compose up --build -d && cd app && npm run test:e2e

git add app/content app/static/audio && git commit  # audio MP3s are committed
# PR → merge → CI builds image → on HAL: dc pull nyolc && dc up -d nyolc
```

**TTS prerequisites** (one-time per machine): `pipx install piper-tts`, then
download `hu_HU-anna-medium.onnx` (+ `.json`) from
https://huggingface.co/rhasspy/piper-voices into `~/.local/share/piper-voices/`.

## Pedagogy guardrails

- **One lesson = one idea.** The callout carries the single trap.
- **Every objective maps to at least one exercise.** If it isn't practised,
  it isn't taught.
- **Sequence types easy→hard:** recognition (mcq/dropdown) → recall
  (fill_blank/card) → production (transform/sentence_build/dialogue) →
  performance (listening/speaking).
- **Reuse validated Hungarian.** New sentences need new validation; sentences
  already through the MoE gate are free.
- **Real-world framing beats abstract drills** — "Kérek egy kávét" over
  disconnected conjugation rows (the table block covers the systematic view).
- **7–9 exercises per lesson.** Below 6 the SRS has too little to work with;
  above 10 completion rates will suffer.
- Curriculum sequence lives in `devdocs/curriculum-plan.md` (52-week map,
  A1→B2); pick the next lesson from there rather than inventing scope.
