<script lang="ts">
  import { classifyAnswer, FEEDBACK, type AnswerClass } from '$lib/engine/validate';

  type Gap = { before: string; answer: string; after: string; translation?: string };
  let { payload, onResult }: { payload: { intro?: string; gaps: Gap[] }; onResult?: (r: AnswerClass) => void } = $props();

  let values = $state<string[]>(payload.gaps.map(() => ''));
  let results = $state<(AnswerClass | null)[]>(payload.gaps.map(() => null));

  function check(i: number) {
    results[i] = classifyAnswer(values[i], payload.gaps[i].answer);
    if (results.every((r) => r !== null)) {
      const worst: AnswerClass = results.includes('wrong') ? 'wrong' : results.includes('accent') ? 'accent' : 'correct';
      onResult?.(worst);
    }
  }
</script>

<div>
  {#if payload.intro}<p class="text-sm italic text-slate-500">{payload.intro}</p>{/if}
  <ol class="mt-2 space-y-3">
    {#each payload.gaps as gap, i}
      <li class="text-slate-700">
        {gap.before}
        <input
          bind:value={values[i]}
          onkeydown={(e) => e.key === 'Enter' && check(i)}
          class="mx-1 w-28 rounded-md border border-slate-300 px-2 py-1 text-center"
          aria-label={`gap ${i + 1}`}
        />
        {gap.after}
        <button onclick={() => check(i)} class="ml-2 rounded-md bg-teal-700 px-2 py-0.5 text-xs font-semibold text-white hover:bg-teal-800">Check</button>
        {#if results[i]}<span class="ml-2 text-sm" data-testid="feedback-{i}">{FEEDBACK[results[i]!]}</span>{/if}
        {#if gap.translation}<p class="text-xs italic text-slate-400">{gap.translation}</p>{/if}
      </li>
    {/each}
  </ol>
</div>
