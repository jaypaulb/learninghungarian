// Content validation schemas — plain JS + zod so BOTH the import script
// (runtime image, no TS tooling) and the SvelteKit app (re-exported via
// $lib/content) share one source of truth. Payloads are versioned and
// type-discriminated: new exercise types (listening/speaking, SP3) are
// additive — no schema migration.
import { z } from 'zod';

export const PAYLOAD_SCHEMA_VERSION = 1;

const base = { translation: z.string().optional(), hint: z.string().optional() };

export const exercisePayloads = {
  fill_blank: z.object({
    ...base,
    prompt: z.string().min(1), // sentence containing ___
    answer: z.string().min(1)
  }),
  mcq: z.object({
    ...base,
    prompt: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    correctIndex: z.number().int().nonnegative()
  }),
  dropdown: z.object({
    ...base,
    prompt: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    correct: z.string().min(1)
  }),
  card_flip: z.object({
    ...base,
    front: z.string().min(1),
    back: z.string().min(1)
  }),
  sentence_build: z.object({
    ...base,
    words: z.array(z.string().min(1)).min(2),
    answer: z.string().min(1)
  }),
  transform: z.object({
    ...base,
    prompt: z.string().min(1),
    instruction: z.string().min(1),
    answer: z.string().min(1)
  }),
  dialogue: z.object({
    ...base,
    intro: z.string().optional(),
    gaps: z
      .array(
        z.object({
          before: z.string(),
          answer: z.string().min(1),
          after: z.string(),
          translation: z.string().optional()
        })
      )
      .min(1)
  })
};

export const exerciseTypes = Object.keys(exercisePayloads);

export const exerciseSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, 'exercise id must be kebab-case'),
    type: z.enum(exerciseTypes),
    srs: z.array(z.string()).default([]),
    payload: z.unknown()
  })
  .superRefine((ex, ctx) => {
    const result = exercisePayloads[ex.type].safeParse(ex.payload);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['payload', ...issue.path],
          message: `${ex.type}: ${issue.message}`
        });
      }
    }
  });

export const contentBlockSchema = z.object({
  type: z.enum(['prose', 'table', 'example', 'callout']),
  payload: z.record(z.unknown())
});

export const srsItemSchema = z.object({
  id: z.string().regex(/^(vocab|grammar):[a-z0-9-]+$/),
  payload: z.record(z.unknown())
});

export const lessonSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  version: z.number().int().positive(),
  position: z.number().int().nonnegative(),
  status: z.enum(['draft', 'reviewed', 'community_verified']).default('draft'),
  objectives: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  skills: z.array(z.enum(['reading', 'writing', 'listening', 'speaking'])).default([]),
  minutes: z.number().int().positive().optional(),
  sources: z.array(z.string()).default([]),
  provenance: z.record(z.string()).default({}),
  blocks: z.array(contentBlockSchema).default([]),
  srsItems: z.array(srsItemSchema).default([]),
  exercises: z.array(exerciseSchema).default([])
});

export const assessmentSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  tier: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  title: z.string().min(1),
  description: z.string().optional(),
  version: z.number().int().positive(),
  exercises: z.array(exerciseSchema).min(1)
});

export const moduleSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  tier: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  title: z.string().min(1),
  description: z.string().optional(),
  position: z.number().int().nonnegative()
});
