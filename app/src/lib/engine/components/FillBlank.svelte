<script lang="ts">
  import { classifyAnswer, FEEDBACK, type AnswerClass } from '$lib/engine/validate';

  let { payload, onResult }: { payload: { prompt: string; answer: string; translation?: string; hint?: string }; onResult?: (r: AnswerClass) => void } = $props();

  let value = $state('');
  let result = $state<AnswerClass | null>(null);
  let revealed = $state(false);

  function check() {
    result = classifyAnswer(value, payload.answer);
    onResult?.(result);
  }
</script>

<div>
  <p class="text-slate-700">
    {#each payload.prompt.split('___') as part, i}
      {part}{#if i < payload.prompt.split('___').length - 1}<input
          bind:value
          onkeydown={(e) => e.key === 'Enter' && check()}
          class="mx-1 w-32 rounded-md border border-slate-300 px-3 py-1 text-center"
          aria-label="answer"
        />{/if}
    {/each}
  </p>
  {#if payload.translation}<p class="mt-1 text-sm italic text-slate-500">{payload.translation}</p>{/if}
  <div class="mt-2 flex items-center gap-3">
    <button onclick={check} class="rounded-md bg-teal-700 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-800">Check</button>
    {#if result}<span class="text-sm" role="status" data-testid="feedback">{FEEDBACK[result]}</span>{/if}
    {#if result && result !== 'correct'}
      <button onclick={() => (revealed = true)} class="text-sm text-slate-500 hover:underline">Show answer</button>
    {/if}
    {#if revealed}<span class="text-sm font-semibold text-teal-700">{payload.answer}</span>{/if}
  </div>
</div>
