<script lang="ts">
  import { classifySequence, FEEDBACK, type AnswerClass } from '$lib/engine/validate';

  let { payload, onResult }: { payload: { words: string[]; answer: string; translation?: string }; onResult?: (r: AnswerClass) => void } = $props();

  // Click-to-place tiles: keyboard-accessible, no drag-drop dependency.
  let placed = $state<number[]>([]);
  let result = $state<AnswerClass | null>(null);

  const available = $derived(payload.words.map((w, i) => ({ w, i })).filter(({ i }) => !placed.includes(i)));

  function place(i: number) {
    placed = [...placed, i];
    result = null;
  }
  function unplace(i: number) {
    placed = placed.filter((p) => p !== i);
    result = null;
  }
  function check() {
    result = classifySequence(placed.map((i) => payload.words[i]), payload.answer);
    onResult?.(result);
  }
</script>

<div>
  {#if payload.translation}<p class="text-sm italic text-slate-500">{payload.translation}</p>{/if}
  <div class="mt-2 min-h-10 rounded-md border border-dashed border-slate-300 p-2" aria-label="your sentence">
    {#each placed as i}
      <button onclick={() => unplace(i)} class="mr-1 rounded-md bg-teal-700 px-2 py-1 text-sm text-white">{payload.words[i]}</button>
    {/each}
  </div>
  <div class="mt-2 flex flex-wrap gap-2" aria-label="word tiles">
    {#each available as { w, i }}
      <button onclick={() => place(i)} class="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-50">{w}</button>
    {/each}
  </div>
  <div class="mt-2 flex items-center gap-3">
    <button onclick={check} disabled={placed.length !== payload.words.length} class="rounded-md bg-teal-700 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40">Check</button>
    {#if result}<span class="text-sm" data-testid="feedback">{FEEDBACK[result]}</span>{/if}
  </div>
</div>
