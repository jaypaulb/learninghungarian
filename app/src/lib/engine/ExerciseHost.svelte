<script lang="ts">
  import type { AnswerClass } from '$lib/engine/validate';
  import FillBlank from './components/FillBlank.svelte';
  import Mcq from './components/Mcq.svelte';
  import Dropdown from './components/Dropdown.svelte';
  import CardFlip from './components/CardFlip.svelte';
  import SentenceBuild from './components/SentenceBuild.svelte';
  import Transform from './components/Transform.svelte';
  import Dialogue from './components/Dialogue.svelte';

  let { exercise, onResult }: { exercise: { id: string; type: string; payload: unknown }; onResult?: (exerciseId: string, r: AnswerClass) => void } = $props();

  const components: Record<string, unknown> = {
    fill_blank: FillBlank,
    mcq: Mcq,
    dropdown: Dropdown,
    card_flip: CardFlip,
    sentence_build: SentenceBuild,
    transform: Transform,
    dialogue: Dialogue
  };

  const Component = components[exercise.type] as typeof FillBlank | undefined;
  const report = (r: AnswerClass) => onResult?.(exercise.id, r);
</script>

<div class="rounded-lg border border-slate-100 p-4" data-exercise-id={exercise.id} data-exercise-type={exercise.type}>
  {#if Component}
    <Component payload={exercise.payload as never} onResult={report} />
  {:else}
    <!-- Future types (listening/speaking, SP3) render a placeholder, never crash. -->
    <p class="text-sm text-slate-400">This exercise type ({exercise.type}) isn't available yet.</p>
  {/if}
</div>
