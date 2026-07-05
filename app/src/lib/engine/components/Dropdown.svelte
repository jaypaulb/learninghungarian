<script lang="ts">
  import { FEEDBACK, type AnswerClass } from '$lib/engine/validate';

  let { payload, onResult }: { payload: { prompt: string; options: string[]; correct: string; translation?: string }; onResult?: (r: AnswerClass) => void } = $props();

  let result = $state<AnswerClass | null>(null);

  function onChange(e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    if (!v) return;
    result = v === payload.correct ? 'correct' : 'wrong';
    onResult?.(result);
  }
</script>

<div>
  <p class="text-slate-700">
    {#each payload.prompt.split('___') as part, i}
      {part}{#if i < payload.prompt.split('___').length - 1}<select
          onchange={onChange}
          class="mx-1 rounded-md border border-slate-300 px-2 py-1"
          aria-label="choose"
        >
          <option value="">…</option>
          {#each payload.options as option}<option value={option}>{option}</option>{/each}
        </select>{/if}
    {/each}
  </p>
  {#if payload.translation}<p class="mt-1 text-sm italic text-slate-500">{payload.translation}</p>{/if}
  {#if result}<p class="mt-2 text-sm" data-testid="feedback">{FEEDBACK[result]}</p>{/if}
</div>
