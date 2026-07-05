<script lang="ts">
  let { lessonId }: { lessonId: string } = $props();

  let open = $state(false);
  let message = $state('');
  let consent = $state(false);
  let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
  let errorText = $state('');

  async function submit() {
    status = 'sending';
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, message, consentContact: consent })
      });
      if (!res.ok) {
        errorText = (await res.json().catch(() => null))?.message ?? `HTTP ${res.status}`;
        status = 'error';
        return;
      }
      status = 'sent';
    } catch {
      errorText = 'network error';
      status = 'error';
    }
  }
</script>

<section class="mt-8 rounded-xl border border-slate-200 p-4">
  {#if !open}
    <button onclick={() => (open = true)} class="text-sm text-teal-700 hover:underline">
      🖋 Suggest a correction or improvement
    </button>
  {:else if status === 'sent'}
    <p class="text-sm text-emerald-700" data-testid="feedback-sent">
      Köszönjük! Your suggestion is queued for review — every correction makes the course better.
    </p>
  {:else}
    <label class="block text-sm font-semibold text-slate-600" for="feedback-message">
      What's wrong, or what could be better?
    </label>
    <textarea
      id="feedback-message"
      bind:value={message}
      maxlength="2000"
      rows="3"
      class="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
      placeholder="e.g. 'kertben' is right, but the example sentence sounds unnatural — a Hungarian would say…"
    ></textarea>
    <label class="mt-2 flex items-center gap-2 text-xs text-slate-500">
      <input type="checkbox" bind:checked={consent} />
      You may email me the outcome of this suggestion (uses your sign-in address).
    </label>
    <div class="mt-2 flex items-center gap-3">
      <button
        onclick={submit}
        disabled={status === 'sending' || !message.trim()}
        class="rounded-md bg-teal-700 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40"
        >Send</button
      >
      {#if status === 'error'}<span class="text-sm text-red-600">{errorText}</span>{/if}
    </div>
  {/if}
</section>
