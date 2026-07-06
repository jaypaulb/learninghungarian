# Design

Visual system for magyarul.nyolc.cc (SvelteKit + Tailwind, app/). Captured
from the shipped code 2026-07-06, with the evolution direction set by
PRODUCT.md (energetic & encouraging).

## Theme

Light, single theme. Scene: an adult learner at the kitchen table in the
evening or on a phone during a commute; ambient light varies, text-heavy
Hungarian content must stay maximally legible — light surfaces with warm
accents. (Dark mode is a future nicety, not a default.)

## Color

Strategy: **Committed** — teal carries identity through actions and progress;
warm amber/emerald signal states. Avoid pure black/white; tint neutrals.

| Role | Current (Tailwind) | Notes |
|---|---|---|
| Action / identity | `teal-700` (#0f766e), hover `teal-800` | buttons, links, active states |
| Page surface | `slate-100` | body background |
| Card surface | `white` | should move to a slightly warm off-white |
| Body text | `slate-700` / `slate-600` | |
| Success / correct | `emerald-*` | correct answers, completed, accepted |
| Accent-warning | `amber-*` | "check your accents" grade, drafts, in-progress |
| Error / wrong | `red-*` | wrong answers, destructive actions |
| Status badges | amber=draft, sky=provisional, emerald=community-verified | honest-labeling ladder |

## Typography

- **Inter**, weights 400/600/700 (loaded via app CSS).
- Hungarian diacritics rule: exercise-critical Hungarian ≥ 1rem, never
  tighten letter-spacing below normal; ő/ö and ű/ü must be distinguishable.
- Hierarchy: page title `text-2xl font-bold`, section `text-lg font-semibold`,
  body `text-sm`/`text-base`; keep ≥1.25 scale steps.

## Components

- **Exercise shell**: bordered light card per exercise (`rounded-lg border
  border-slate-100 p-4`) with `data-exercise-id`/`data-exercise-type`.
- **Feedback line**: emoji + short verdict (✔️ / 🔶 accents / ✖️) via
  `FEEDBACK` map in `$lib/engine/validate.ts` — single source of truth.
- **AudioButton**: pill with 🔉 play / 🔊 playing pulse; error chip on failure.
- **Buttons**: solid teal primary, outlined teal secondary, outlined red
  destructive; `rounded-md px-3/4 py-1/2 text-sm font-semibold`.
- **Badges**: `rounded-full px-2 py-0.5 text-xs` tinted per status.
- **Nav**: minimal — back-links top-left, prev/next lesson footer chain.

## Motion

Sparing and functional: `animate-pulse` on live audio, transitions on hover
states. Respect `prefers-reduced-motion` (audit item). Ease-out only; nothing
bouncy. Progress celebration (checkpoint pass) is the one place bigger motion
is allowed.

## Layout

- Content column `max-w-3xl mx-auto`, page padding `p-4 md:p-8`
  (admin uses `max-w-4xl`).
- Mobile-first; exercises must be fully usable on a phone (tile buttons and
  inputs sized for touch, ≥44px targets).

## Voice & copy

Short, encouraging, bilingual garnish: Hungarian interjections with context
(Köszönjük!, gondolkodom…). Errors never blame; they redirect ("Not quite —
try again", "Right word — check the accents!").
