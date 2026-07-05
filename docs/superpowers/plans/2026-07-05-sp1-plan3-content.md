# SP1 Plan 3 — Tier-Aware Content Model & Import

**Goal:** The spec §4 content scaffold: `tier → module → lesson → {blocks, exercises}` (+ per-tier assessments), authored as YAML in-repo, imported idempotently into Postgres. Content ships **inside the image** (COPY at build; import runs in the entrypoint after migrate) so a deploy is atomic: code + schema + content move together.

## Schema (Drizzle; stable text IDs everywhere)

- `cefr_tier` pg enum: A1 A2 B1 B2 C1 C2 (enum-extensible; C1/C2 never seeded into nav)
- `modules(id text pk, tier, title, description, position)`
- `lessons(id text pk, module_id fk, position, title, objectives jsonb, prerequisites jsonb, skill_tags jsonb, status: draft|reviewed|community_verified, content_version int, sources jsonb, provenance jsonb, estimated_minutes)`
- `content_blocks(lesson_id fk, position, type: prose|table|example|callout, payload jsonb, pk(lesson_id, position))`
- `exercises(id text pk, lesson_id fk nullable, assessment_id fk nullable, position, type text, payload_schema_version int, payload jsonb, content_version int)` — belongs to a lesson OR an assessment
- `assessments(id text pk, tier, title, description, position)`
- `srs_items(id text pk, kind: vocab|grammar, payload jsonb)` + `exercise_srs_items(exercise_id, srs_item_id, pk both)`

## Content format

`app/content/<tier>/<module-dir>/<lesson>.yaml` + `app/content/<tier>/assessment.yaml`, validated by zod schemas in `$lib/content/schema.ts` (shared with the Plan 4 engine — payloads are type-discriminated and versioned). Author-managed `version:` per lesson; changing content without bumping version fails the import (drift guard).

## Import (`app/scripts/import-content.js` → `npm run content:import`)

- Parse + zod-validate all YAML; fail loudly on any error (no partial imports: single transaction).
- Upsert by stable ID; deletions in repo → **orphan warning, not delete** (progress safety; deprecation policy hardens later).
- Idempotent: re-running with unchanged content is a no-op (tested).
- Entrypoint: `migrate → import → serve`.

## Tasks
1. Schema + migration + zod content schemas (unit-tested validation)
2. Importer + sample smoke-test lesson (tiny, marked draft) + idempotency tests against dev PG
3. Entrypoint/image wiring + curriculum index page (`/learn`) rendering tiers→modules→lessons from DB
4. Deploy + verify

## DoD
- [ ] Migration applies; import of sample content idempotent (run twice = same row state)
- [ ] Invalid YAML/payload fails import with a useful error; version-drift guard works
- [ ] `/learn` lists the imported curriculum behind the gate
- [ ] Live on magyarul.nyolc.cc
