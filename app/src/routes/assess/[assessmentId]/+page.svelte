<script lang="ts">
  import ExerciseHost from '$lib/engine/ExerciseHost.svelte';
  import type { AnswerClass } from '$lib/engine/validate';

  let { data } = $props();

  // First result per exercise counts — assessment scoring is first-attempt.
  let results = $state<Record<string, AnswerClass>>({});

  function record(exerciseId: string, result: AnswerClass) {
    if (!(exerciseId in results)) results[exerciseId] = result;
    fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, result })
    }).catch(() => {});
  }

  const answered = $derived(Object.keys(results).length);
  const correct = $derived(Object.values(results).filter((r) => r === 'correct').length);
  const done = $derived(answered >= data.exercises.length);
  const passed = $derived(correct / Math.max(1, data.exercises.length) >= 0.8);
</script>

<main class="mx-auto max-w-3xl p-8">
  <a href="/learn" class="text-sm text-teal-700 hover:underline">&larr; Curriculum</a>
  <h1 class="mt-2 text-2xl font-bold text-teal-700">{data.assessment.title}</h1>
  {#if data.assessment.description}<p class="mt-1 text-slate-600">{data.assessment.description}</p>{/if}
  <p class="mt-2 text-sm text-slate-500">{answered}/{data.exercises.length} answered. First attempt counts.</p>

  <div class="mt-6 space-y-4">
    {#each data.exercises as exercise (exercise.id)}
      <ExerciseHost {exercise} onResult={record} />
    {/each}
  </div>

  {#if done}
    <div class="mt-8 rounded-xl p-6 shadow-md {passed ? 'bg-emerald-50' : 'bg-amber-50'}" data-testid="assessment-result">
      <h2 class="text-lg font-bold {passed ? 'text-emerald-800' : 'text-amber-800'}">
        {passed ? '🎉 Passed!' : 'Not yet. Keep practising!'}
      </h2>
      <p class="mt-1 text-sm text-slate-700">
        {correct}/{data.exercises.length} correct on first attempt{passed
          ? `. Szép munka! The ${data.assessment.tier} level has stuck.`
          : '. Revisit the lessons and try again (80% to pass).'}
      </p>
    </div>
  {/if}
</main>
