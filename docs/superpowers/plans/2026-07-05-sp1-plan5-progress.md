# SP1 Plan 5 — Progress Tracking & SRS Scaffold

**Goal:** Per-user progress that survives devices, and correct SRS scheduling data (spec §6.2–6.3) — Codex-hardened model: state per **item × skill × modality × direction**.

## Schema (all user-FKs ON DELETE CASCADE → GDPR delete stays one statement)

- `exercise_progress(user_id, exercise_id, first_result, best_result, attempts, last_attempt_at, pk(user,exercise))`
- `lesson_progress(user_id, lesson_id, status in_progress|completed, first_accuracy real, last_visited_at, pk(user,lesson))`
- `user_srs_state(user_id, srs_item_id, skill, modality, direction, ease real, interval_days real, due_at, reps, lapses, pk(user,item,skill,modality,direction))`

## Scheduler

SM-2 (pure, unit-tested): `sm2(prev, quality 0-5) → next`. Result mapping:
correct→5, accent→3, wrong→1; card self-grade knew→4 / didn't→1.
Direction: card_flip = `recognition`, all others `production`; modality `text`
(listening/speaking arrive SP3); skill from lesson `skill_tags[0] ?? reading`.

## Flow

`ExerciseHost.onResult` → `POST /api/attempts {exerciseId, result}` →
transaction: upsert exercise_progress (first_result immutable), recompute
lesson_progress (completed when every lesson exercise attempted;
first_accuracy = share of exercises whose FIRST attempt was correct), update
user_srs_state for linked srs_items. Lesson page load touches
last_visited_at. `/learn` shows per-lesson progress; `/review` = minimal
due-items card-flip session. `/account/export` gains progress + SRS sections.

## Tasks
1. Schema + migration + sm2 unit tests
2. /api/attempts + recompute logic (integration-tested)
3. Client wiring (ExerciseHost→POST), /learn indicators, /review page, export
4. e2e + deploy + live verify

## DoD
- [ ] sm2 unit-tested (repeat correct grows interval; wrong resets + lapse)
- [ ] Attempts idempotently aggregate; first_result never overwritten
- [ ] Lesson completes when all exercises attempted; accuracy correct
- [ ] /review schedules due items; export includes progress+SRS; live verify
