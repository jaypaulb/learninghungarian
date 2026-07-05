# SP1 Plan 4 — Exercise Engine

**Goal:** The seven core exercise types as Svelte components with Hungarian accent-aware validation, and a lesson page that renders imported content end-to-end.

## Design

- **`$lib/engine/validate.ts`** — pure functions, exhaustively unit-tested:
  `classifyAnswer(input, expected) → 'correct' | 'accent' | 'wrong'`.
  Normalization: trim, lowercase, collapse whitespace. `'accent'` = equal
  after stripping Hungarian diacritics (á é í ó ö ő ú ü ű) but not equal
  before — the learner has the right word, wrong orthography. Distinct
  feedback per class (spec §5).
- **Components** (`$lib/engine/components/`): FillBlank, Mcq, Dropdown,
  CardFlip (self-graded), SentenceBuild (click-to-place word tiles —
  keyboard-accessible, no drag-drop dependency), Transform, Dialogue
  (sequential gaps). Shared contract: `{ payload, onResult(outcome) }`;
  `ExerciseHost.svelte` dispatches by `type` and renders feedback + reveal.
  `onResult` is the Plan 5 seam (progress/SRS recording).
- **Lesson page** `/learn/[lessonId]` — blocks (prose/table/example/callout),
  exercises via ExerciseHost, status badge + sources footer (honest-labeling
  requirement from the spec).
- **Testing**: validation = deep vitest coverage (the correctness core);
  components = Playwright browser tests against the real containerized stack
  (real interactions beat jsdom mocks at this layer).

## Tasks
1. validate.ts + exhaustive tests
2. Seven components + ExerciseHost
3. Lesson page (blocks + exercises + badge/sources)
4. Playwright browser tests; deploy + live verify

## DoD
- [ ] classifyAnswer covers: exact, case, whitespace, each diacritic, mixed, wrong
- [ ] All 7 types render and validate in the browser (Playwright)
- [ ] Lesson page shows badge + sources; smoke-test lesson fully interactive
- [ ] Live on magyarul.nyolc.cc
