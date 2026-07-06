<script lang="ts">
  import type { AnswerClass } from '$lib/engine/validate';
  import AudioButton from './AudioButton.svelte';

  let { payload, onResult }: { payload: { front: string; back: string; audioUrl?: string }; onResult?: (r: AnswerClass) => void } = $props();

  let flipped = $state(false);
  let graded = $state(false);

  function grade(knewIt: boolean) {
    graded = true;
    onResult?.(knewIt ? 'correct' : 'wrong');
  }
</script>

<div>
  <div class="flex items-center gap-2">
    {#if payload.audioUrl}<AudioButton src={payload.audioUrl} label="Hear the word" />{/if}
    <p class="text-sm font-semibold text-slate-500">
      🃏 Flashcard: do you know what this means? Recall it, then tap the card to check.
    </p>
  </div>
  <button
    onclick={() => !graded && (flipped = !flipped)}
    class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-6 text-center hover:bg-slate-100"
    aria-label="flip card"
  >
    {#if graded}
      <span class="text-lg font-semibold text-slate-700" lang="hu">{payload.front}</span>
      <span class="mx-2 text-slate-500">=</span>
      <span class="text-lg text-teal-700">{payload.back}</span>
    {:else if flipped}
      <span class="text-lg font-semibold text-slate-700">{payload.back}</span>
    {:else}
      <span class="text-lg font-semibold text-slate-700" lang="hu">{payload.front}</span>
      <span class="mt-1 block text-xs font-normal text-slate-500">tap to reveal</span>
    {/if}
  </button>
  {#if flipped && !graded}
    <p class="mt-2 text-center text-xs text-slate-500">Be honest: this schedules when you'll see the word again.</p>
    <div class="mt-1 flex justify-center gap-3">
      <button onclick={() => grade(false)} class="min-h-9 rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">Didn't know</button>
      <button onclick={() => grade(true)} class="min-h-9 rounded-md border border-emerald-300 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50">Knew it</button>
    </div>
  {:else if graded}
    <p class="mt-2 text-center text-sm text-slate-500" role="status" data-testid="feedback">
      Saved! This word will come back for review at the right time.
    </p>
  {/if}
</div>
