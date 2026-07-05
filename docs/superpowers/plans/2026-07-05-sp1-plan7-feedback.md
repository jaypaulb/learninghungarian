# SP1 Plan 7 — Feedback Capture (private-first, PII-free issues)

**Goal:** The capture end of the crowd-validation loop (spec §7.5 Layer 2). Private Postgres row first; a sanitized GitHub issue carries ONLY the internal ID. The processing agent, trust tiers, and outcome emails are SP6 (post-SP1).

## Design

- `feedback(id uuid, user_id FK cascade, lesson_id?, exercise_id?, content_version, message text ≤2000, consent_contact bool, status new|triaged|accepted|rejected, github_issue int?, created_at)`
- **Privacy:** the GitHub issue contains the feedback UUID + lesson/exercise slugs only — no message text (prompt-injection surface), no email, no user identity. The SP6 agent reads the DB for the payload.
- **Rate limit:** ≤5 submissions per user per hour (DB count).
- **Sanitization:** length cap, control-char strip; consent checkbox stored explicitly.
- **Degradation:** without `GITHUB_FEEDBACK_TOKEN` in env, the issue step is skipped with a loud log line (row still stored) — SP1 deploys with zero new secrets; adding the token later upgrades the pipeline in place.
- UI: "Suggest a correction" disclosure on the lesson page → POST `/api/feedback`.
- Export gains a `feedback` section; delete cascades.

## DoD
- [ ] Row stored with consent + refs; rate limit enforced (integration-tested)
- [ ] Issue creation skipped-but-logged without token; PII-free body when enabled
- [ ] Lesson-page form works e2e; export includes feedback
