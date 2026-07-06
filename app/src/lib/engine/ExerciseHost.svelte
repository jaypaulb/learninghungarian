<script lang="ts">
  import type { AnswerClass } from '$lib/engine/validate';
  import FillBlank from './components/FillBlank.svelte';
  import Mcq from './components/Mcq.svelte';
  import Dropdown from './components/Dropdown.svelte';
  import CardFlip from './components/CardFlip.svelte';
  import SentenceBuild from './components/SentenceBuild.svelte';
  import Transform from './components/Transform.svelte';
  import Dialogue from './components/Dialogue.svelte';
  import Listening from './components/Listening.svelte';
  import Speaking from './components/Speaking.svelte';

  let { exercise, onResult }: { exercise: { id: string; type: string; payload: unknown }; onResult?: (exerciseId: string, r: AnswerClass) => void } = $props();

  const components: Record<string, unknown> = {
    fill_blank: FillBlank,
    mcq: Mcq,
    dropdown: Dropdown,
    card_flip: CardFlip,
    sentence_build: SentenceBuild,
    transform: Transform,
    dialogue: Dialogue,
    listening: Listening
  };
  // Speaking is special-cased: it posts to /api/speech itself, so it needs
  // the exercise id, and its attempt recording happens server-side.

  // $derived: must track the prop, not capture its initial value —
  // positional reuse across navigations otherwise pairs an old component
  // type with a new payload.
  const Component = $derived(components[exercise.type] as typeof FillBlank | undefined);
  const report = (r: AnswerClass) => onResult?.(exercise.id, r);
</script>

<div class="rounded-lg border border-slate-100 p-4" data-exercise-id={exercise.id} data-exercise-type={exercise.type}>
  {#if exercise.type === 'speaking'}
    <Speaking payload={exercise.payload as never} exerciseId={exercise.id} onResult={report} />
  {:else if Component}
    <Component payload={exercise.payload as never} onResult={report} />
  {:else}
    <!-- Future types (listening/speaking, SP3) render a placeholder, never crash. -->
    <p class="text-sm text-slate-500">This exercise type ({exercise.type}) isn't available yet.</p>
  {/if}
</div>
