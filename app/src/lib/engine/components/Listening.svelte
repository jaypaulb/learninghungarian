<script lang="ts">
  import { classifyAnswer, FEEDBACK, type AnswerClass } from '$lib/engine/validate';
  import AudioButton from './AudioButton.svelte';

  type Payload = {
    audioUrl?: string;
    mode: 'transcribe' | 'meaning';
    answer?: string;
    options?: string[];
    correctIndex?: number;
    translation?: string;
    hint?: string;
  };
  let { payload, onResult }: { payload: Payload; onResult?: (r: AnswerClass) => void } = $props();

  let value = $state('');
  let picked = $state<number | null>(null);
  let result = $state<AnswerClass | null>(null);
  let revealed = $state(false);

  function checkTranscribe() {
    result = classifyAnswer(value, payload.answer ?? '');
    onResult?.(result);
  }
  function choose(i: number) {
    picked = i;
    result = i === payload.correctIndex ? 'correct' : 'wrong';
    onResult?.(result);
  }
</script>

<div>
  <div class="flex items-center gap-3">
    {#if payload.audioUrl}
      <AudioButton src={payload.audioUrl} label="Play the Hungarian" />
    {/if}
    <p class="text-sm font-semibold text-slate-500">
      🎧 Listen{payload.mode === 'transcribe' ? ', then type exactly what you hear.' : ' — what does it mean?'}
    </p>
  </div>
  {#if payload.hint}<p class="mt-1 text-xs italic text-slate-400">{payload.hint}</p>{/if}

  {#if payload.mode === 'transcribe'}
    <div class="mt-2 flex items-center gap-3">
      <input
        bind:value
        onkeydown={(e) => e.key === 'Enter' && checkTranscribe()}
        class="w-64 rounded-md border border-slate-300 px-3 py-1"
        aria-label="what you heard"
      />
      <button onclick={checkTranscribe} class="rounded-md bg-teal-700 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-800">Check</button>
    </div>
    <div class="mt-2 flex items-center gap-3">
      {#if result}<span class="text-sm" data-testid="feedback">{FEEDBACK[result]}</span>{/if}
      {#if result && result !== 'correct'}
        <button onclick={() => (revealed = true)} class="text-sm text-slate-500 hover:underline">Show answer</button>
      {/if}
      {#if revealed}<span class="text-sm font-semibold text-teal-700">{payload.answer}</span>{/if}
    </div>
  {:else}
    <div class="mt-2 flex flex-wrap gap-2">
      {#each payload.options ?? [] as option, i}
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
    {#if result}<p class="mt-2 text-sm" data-testid="feedback">{FEEDBACK[result]}</p>{/if}
  {/if}
  {#if result && payload.translation}<p class="mt-1 text-sm italic text-slate-500">{payload.translation}</p>{/if}
</div>
