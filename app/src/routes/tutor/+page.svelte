<script lang="ts">
  type Msg = { role: 'user' | 'assistant'; content: string };
  let history = $state<Msg[]>([]);
  let input = $state('');
  let busy = $state(false);
  let errorText = $state('');

  const chips = [
    'Correct my sentence: Én vagyok tanár.',
    'Explain vowel harmony with two examples.',
    'Chat with me in simple Hungarian about food.',
    'Grade this writing: Szia! Anna vagyok es tanar vagyok.'
  ];

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    input = '';
    errorText = '';
    history = [...history, { role: 'user', content }];
    busy = true;
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
      });
      if (!res.ok) {
        errorText = (await res.json().catch(() => null))?.message ?? `HTTP ${res.status}`;
        history = history.slice(0, -1);
        input = content;
        return;
      }
      const data = await res.json();
      history = [...history, { role: 'assistant', content: data.reply }];
    } catch {
      errorText = 'network error';
      history = history.slice(0, -1);
      input = content;
    } finally {
      busy = false;
    }
  }
</script>

<main class="mx-auto flex h-[calc(100vh-2rem)] max-w-3xl flex-col p-4 md:p-8">
  <div class="flex items-center justify-between">
    <a href="/" class="text-sm text-teal-700 hover:underline">&larr; Home</a>
  </div>
  <h1 class="mt-2 text-2xl font-bold text-teal-700">Tutor</h1>
  <p class="text-sm text-slate-500">Ask anything about Hungarian — corrections, explanations, or just chat.</p>

  <div class="mt-4 flex-1 space-y-3 overflow-y-auto rounded-xl bg-white p-4 shadow-md" data-testid="chat-log">
    {#if history.length === 0}
      <p class="text-sm text-slate-400">Try one of these to start:</p>
      <div class="flex flex-wrap gap-2">
        {#each chips as chip}
          <button onclick={() => send(chip)} class="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs text-teal-800 hover:bg-teal-100">{chip}</button>
        {/each}
      </div>
    {/if}
    {#each history as msg}
      <div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm {msg.role === 'user'
            ? 'bg-teal-700 text-white'
            : 'bg-slate-100 text-slate-700'}">{msg.content}</div>
      </div>
    {/each}
    {#if busy}<p class="text-sm text-slate-400" data-testid="thinking">gondolkodom…</p>{/if}
  </div>

  {#if errorText}<p class="mt-2 text-sm text-red-600" data-testid="tutor-error">{errorText}</p>{/if}
  <form
    class="mt-3 flex gap-2"
    onsubmit={(e) => {
      e.preventDefault();
      send();
    }}
  >
    <input
      bind:value={input}
      disabled={busy}
      placeholder="Írj valamit… (write something)"
      class="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
      aria-label="message"
    />
    <button type="submit" disabled={busy || !input.trim()} class="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40">Send</button>
  </form>
</main>
