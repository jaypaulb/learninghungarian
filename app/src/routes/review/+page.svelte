<script lang="ts">
  import AudioButton from '$lib/engine/components/AudioButton.svelte';

  let { data } = $props();
  let index = $state(0);
  let flipped = $state(false);

  const current = $derived(data.due[index] ?? null);

  async function grade(knewIt: boolean) {
    const item = current!;
    await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        srsItemId: item.srsItemId,
        skill: item.skill,
        direction: item.direction,
        result: knewIt ? 'correct' : 'wrong'
      })
    }).catch(() => {});
    flipped = false;
    index += 1;
  }
</script>

<main class="mx-auto max-w-3xl p-8">
  <a href="/" class="text-sm text-teal-700 hover:underline">&larr; Home</a>
  <h1 class="mt-2 text-2xl font-bold text-teal-700">Review</h1>

  {#if !current}
    <p class="mt-6 text-slate-600" data-testid="review-done">
      Nothing due. Szép munka, come back later! 🎉
    </p>
  {:else}
    <p class="mt-1 text-sm text-slate-500">
      {data.due.length - index} due. Recall each word, then tap the card to check yourself.
    </p>
    <button
      onclick={() => (flipped = !flipped)}
      class="mt-6 w-full rounded-xl border border-slate-200 bg-white p-10 text-center text-xl font-semibold text-slate-700 shadow-md hover:bg-slate-50"
      aria-label="flip review card"
    >
      {#if flipped}
        {current.payload.back}
      {:else}
        {current.payload.front}
        <span class="mt-1 block text-xs font-normal text-slate-500">tap to reveal</span>
      {/if}
    </button>
    {#if current.payload.audioUrl}
      <div class="mt-3 flex justify-center">
        <AudioButton src={current.payload.audioUrl} label="Hear the word" />
      </div>
    {/if}
    {#if flipped}
      <div class="mt-4 flex justify-center gap-3">
        <button onclick={() => grade(false)} class="min-h-11 rounded-md border border-red-300 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50">Didn't know</button>
        <button onclick={() => grade(true)} class="min-h-11 rounded-md border border-emerald-300 px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50">Knew it</button>
      </div>
    {/if}
  {/if}
</main>
