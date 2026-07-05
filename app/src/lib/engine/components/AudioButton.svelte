<script lang="ts">
  let { src, label = 'Play audio' }: { src: string; label?: string } = $props();
  let audio: HTMLAudioElement | undefined = $state();
  let playing = $state(false);

  function play() {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
  }
</script>

<audio bind:this={audio} {src} preload="none" onplay={() => (playing = true)} onended={() => (playing = false)}></audio>
<button
  onclick={play}
  class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
  aria-label={label}
  title={label}
  type="button"
>
  {playing ? '🔊' : '🔉'}
</button>
