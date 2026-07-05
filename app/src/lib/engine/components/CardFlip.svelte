<script lang="ts">
  import type { AnswerClass } from '$lib/engine/validate';

  let { payload, onResult }: { payload: { front: string; back: string }; onResult?: (r: AnswerClass) => void } = $props();

  let flipped = $state(false);
  let graded = $state(false);

  function grade(knewIt: boolean) {
    graded = true;
    onResult?.(knewIt ? 'correct' : 'wrong');
  }
</script>

<div>
  <button
    onclick={() => (flipped = !flipped)}
    class="w-full rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-lg font-semibold text-slate-700 hover:bg-slate-100"
    aria-label="flip card"
  >
    {flipped ? payload.back : payload.front}
  </button>
  {#if flipped && !graded}
    <div class="mt-2 flex justify-center gap-3">
      <button onclick={() => grade(false)} class="rounded-md border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50">Didn't know</button>
      <button onclick={() => grade(true)} class="rounded-md border border-emerald-300 px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-50">Knew it</button>
    </div>
  {:else if graded}
    <p class="mt-2 text-center text-sm text-slate-500" data-testid="feedback">Recorded.</p>
  {/if}
</div>
