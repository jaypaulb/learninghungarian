<script lang="ts">
  import ExerciseHost from '$lib/engine/ExerciseHost.svelte';
  import FeedbackForm from '$lib/engine/FeedbackForm.svelte';
  import type { AnswerClass } from '$lib/engine/validate';

  let { data } = $props();

  // Fire-and-forget attempt recording; the UI never blocks on it.
  function record(exerciseId: string, result: AnswerClass) {
    fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, result })
    }).catch(() => {});
  }
  const statusLabel: Record<string, { text: string; cls: string }> = {
    draft: { text: 'draft', cls: 'bg-amber-100 text-amber-800' },
    reviewed: { text: 'AI-drafted, provisional', cls: 'bg-sky-100 text-sky-800' },
    community_verified: { text: 'community-verified', cls: 'bg-emerald-100 text-emerald-800' }
  };
</script>

<main class="mx-auto max-w-3xl p-8">
  <a href="/learn" class="text-sm text-teal-700 hover:underline">&larr; Curriculum</a>
  <div class="mt-2 flex items-center gap-3">
    <h1 class="text-2xl font-bold text-teal-700">{data.lesson.title}</h1>
    <span class="rounded-full px-2 py-0.5 text-xs {statusLabel[data.lesson.status].cls}"
      >{statusLabel[data.lesson.status].text}</span
    >
  </div>

  {#if data.lesson.objectives.length > 0}
    <ul class="mt-2 list-inside list-disc text-sm text-slate-600">
      {#each data.lesson.objectives as objective}<li>{objective}</li>{/each}
    </ul>
  {/if}

  <div class="mt-6 space-y-4 rounded-xl bg-white p-6 shadow-md">
    {#each data.blocks as block}
      {#if block.type === 'prose'}
        <p class="text-slate-700">{(block.payload as { text: string }).text}</p>
      {:else if block.type === 'example'}
        {@const ex = block.payload as { hungarian: string; english: string }}
        <div class="rounded-md bg-slate-50 p-3">
          <p class="font-semibold text-slate-700">{ex.hungarian}</p>
          <p class="text-sm italic text-slate-500">{ex.english}</p>
        </div>
      {:else if block.type === 'callout'}
        <div class="rounded-md border-l-4 border-teal-600 bg-teal-50 p-3 text-sm text-slate-700">
          {(block.payload as { text: string }).text}
        </div>
      {:else if block.type === 'table'}
        {@const t = block.payload as { headers: string[]; rows: string[][] }}
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr>{#each t.headers as h}<th class="border-b border-slate-200 p-2 text-left font-semibold text-slate-600">{h}</th>{/each}</tr></thead>
            <tbody>
              {#each t.rows as row}<tr>{#each row as cell}<td class="border-b border-slate-100 p-2 text-slate-700">{cell}</td>{/each}</tr>{/each}
            </tbody>
          </table>
        </div>
      {/if}
    {/each}
  </div>

  {#if data.exercises.length > 0}
    <h2 class="mt-8 text-lg font-semibold text-slate-700">Practice</h2>
    <div class="mt-3 space-y-4">
      <!-- keyed by id: exercises must be destroyed/recreated across client-side
           navigations, or stale component instances crash on the next lesson's
           payloads (found via prev/next navigation, 2026-07-05) -->
      {#each data.exercises as exercise (exercise.id)}
        <ExerciseHost {exercise} onResult={record} />
      {/each}
    </div>
  {/if}

  <nav class="mt-8 flex items-center justify-between gap-4">
    {#if data.prev}
      <a href="/learn/{data.prev.id}" class="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" data-testid="prev-lesson"
        >&larr; {data.prev.title}</a
      >
    {:else}<span></span>{/if}
    {#if data.next}
      <a href="/learn/{data.next.id}" class="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800" data-testid="next-lesson"
        >{data.next.title} &rarr;</a
      >
    {:else}
      <a href="/learn" class="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800" data-testid="next-lesson"
        >Back to curriculum &rarr;</a
      >
    {/if}
  </nav>

  <FeedbackForm lessonId={data.lesson.id} />

  {#if data.lesson.sources.length > 0}
    <footer class="mt-8 border-t border-slate-200 pt-4">
      <h3 class="text-xs font-semibold uppercase tracking-wide text-slate-400">Sources</h3>
      <ul class="mt-1 text-xs text-slate-500">
        {#each data.lesson.sources as source}<li>{source}</li>{/each}
      </ul>
    </footer>
  {/if}
</main>
