<script lang="ts">
  import { FEEDBACK, type AnswerClass } from '$lib/engine/validate';

  let { payload, onResult }: { payload: { prompt: string; options: string[]; correctIndex: number; translation?: string }; onResult?: (r: AnswerClass) => void } = $props();

  let picked = $state<number | null>(null);
  let result = $state<AnswerClass | null>(null);

  function choose(i: number) {
    picked = i;
    result = i === payload.correctIndex ? 'correct' : 'wrong';
    onResult?.(result);
  }
</script>

<div>
  <p class="text-slate-700">{payload.prompt}</p>
  {#if payload.translation}<p class="mt-1 text-sm italic text-slate-500">{payload.translation}</p>{/if}
  <div class="mt-2 flex flex-wrap gap-2">
    {#each payload.options as option, i}
      <button
        onclick={() => choose(i)}
        class="rounded-md border px-3 py-1 text-sm {picked === i
          ? result === 'correct'
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-red-400 bg-red-50'
          : 'border-slate-300 hover:bg-slate-50'}">{option}</button
      >
    {/each}
  </div>
  {#if result}<p class="mt-2 text-sm" role="status" data-testid="feedback">{FEEDBACK[result]}</p>{/if}
</div>
