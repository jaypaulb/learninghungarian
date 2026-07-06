<script lang="ts">
  import { FEEDBACK, type AnswerClass } from '$lib/engine/validate';
  import AudioButton from './AudioButton.svelte';

  type Payload = { promptText: string; expected: string; audioUrl?: string; translation?: string };
  let {
    payload,
    exerciseId,
    onResult
  }: { payload: Payload; exerciseId: string; onResult?: (r: AnswerClass) => void } = $props();

  let phase = $state<'idle' | 'recording' | 'uploading' | 'done' | 'unsupported' | 'denied' | 'error'>('idle');
  let transcript = $state('');
  let result = $state<AnswerClass | null>(null);
  let recorder: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      phase = 'unsupported';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        await upload(new Blob(chunks, { type: recorder?.mimeType || 'audio/webm' }));
      };
      recorder.start();
      phase = 'recording';
    } catch {
      phase = 'denied';
    }
  }

  function stop() {
    recorder?.stop();
    phase = 'uploading';
  }

  async function upload(blob: Blob) {
    try {
      const form = new FormData();
      form.append('audio', blob, 'speech.webm');
      form.append('exerciseId', exerciseId);
      const res = await fetch('/api/speech', { method: 'POST', body: form });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      transcript = data.transcript;
      result = data.result;
      phase = 'done';
      onResult?.(data.result);
    } catch {
      phase = 'error';
    }
  }
</script>

<div>
  <div class="flex items-center gap-3">
    {#if payload.audioUrl}<AudioButton src={payload.audioUrl} label="Hear the model pronunciation" />{/if}
    <p class="text-sm font-semibold text-slate-500">🎤 Say it out loud:</p>
  </div>
  <p class="mt-1 text-lg font-semibold text-slate-700" lang="hu">{payload.promptText}</p>
  {#if payload.translation}<p class="text-sm italic text-slate-500">{payload.translation}</p>{/if}

  <div class="mt-2 flex items-center gap-3">
    {#if phase === 'idle' || phase === 'done' || phase === 'error'}
      <button onclick={start} class="rounded-md bg-teal-700 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-800" data-testid="record">
        {phase === 'idle' ? '● Record' : '● Try again'}
      </button>
    {:else if phase === 'recording'}
      <button onclick={stop} class="animate-pulse rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white" data-testid="stop">
        ■ Stop
      </button>
    {:else if phase === 'uploading'}
      <span class="text-sm text-slate-500">checking your pronunciation…</span>
    {/if}
    {#if result && phase === 'done'}<span class="text-sm" role="status" data-testid="feedback">{FEEDBACK[result]}</span>{/if}
  </div>

  {#if phase === 'done' && transcript}
    <p class="mt-2 text-sm text-slate-500">I heard: <span class="font-semibold text-slate-700">{transcript}</span></p>
  {:else if phase === 'unsupported'}
    <p class="mt-2 text-sm text-amber-700">Your browser doesn't support recording here.</p>
  {:else if phase === 'denied'}
    <p class="mt-2 text-sm text-amber-700">Microphone permission was blocked. Allow it in the address bar and try again.</p>
  {:else if phase === 'error'}
    <p class="mt-2 text-sm text-red-600">Couldn't check that. Try again!</p>
  {/if}
</div>
