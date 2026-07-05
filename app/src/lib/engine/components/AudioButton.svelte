<script lang="ts">
  let { src, label = 'Play audio' }: { src: string; label?: string } = $props();
  let audio: HTMLAudioElement | undefined = $state();
  let playing = $state(false);
  let failed = $state(false);

  async function play() {
    if (!audio) return;
    try {
      audio.currentTime = 0;
      await audio.play();
    } catch {
      failed = true; // loud, not silent: show the user playback failed
    }
  }
</script>

<audio
  bind:this={audio}
  {src}
  preload="metadata"
  onplay={() => (playing = true)}
  onended={() => (playing = false)}
  onpause={() => (playing = false)}
  onerror={() => (failed = true)}
></audio>
{#if failed}
  <span class="inline-flex h-8 items-center rounded-full border border-red-200 bg-red-50 px-2 text-xs text-red-700" title="Audio failed to play">⚠ audio</span>
{:else}
  <button
    onclick={play}
    class="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-teal-200 px-2 text-teal-700 transition-colors {playing
      ? 'animate-pulse bg-teal-200'
      : 'bg-teal-50 hover:bg-teal-100'}"
    aria-label={label}
    title={label}
    type="button"
  >
    <span>{playing ? '🔊' : '🔉'}</span>
    <span class="text-xs font-semibold">{playing ? 'playing' : 'play'}</span>
  </button>
{/if}
