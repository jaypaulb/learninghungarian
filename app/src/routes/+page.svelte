<script lang="ts">
  let { data } = $props();
  const m = $derived(data.momentum);
</script>

<main class="mx-auto max-w-3xl p-8">
  <h1 class="text-2xl font-bold text-teal-700">Learning Hungarian</h1>
  <p class="mt-1 text-slate-600">Zero to B2, magyarul.</p>

  {#if m}
    <section class="mt-6 rounded-xl bg-white p-6 shadow-md" data-testid="momentum">
      {#if m.next}
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {m.started ? 'Continue where you left off' : 'Kezdjük! (Let’s begin!)'}
        </p>
        <a
          href="/learn/{m.next.id}"
          class="mt-2 inline-block rounded-md bg-teal-700 px-5 py-3 text-base font-semibold text-white hover:bg-teal-800"
          data-testid="continue"
          >{m.next.title} &rarr;</a
        >
      {:else}
        <p class="text-base font-semibold text-emerald-700">
          Every published lesson completed. Szép munka! 🎉
        </p>
      {/if}
      <div class="mt-4 flex flex-wrap gap-2 text-sm">
        <span class="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800"
          >{m.completed}/{m.total} lessons done</span
        >
        {#if m.due > 0}
          <a href="/review" class="rounded-full bg-amber-100 px-3 py-1 text-amber-800 hover:bg-amber-200"
            >{m.due} word{m.due === 1 ? '' : 's'} due for review</a
          >
        {:else}
          <span class="rounded-full bg-stone-200 px-3 py-1 text-slate-600">review queue clear</span>
        {/if}
      </div>
    </section>
  {/if}

  <nav class="mt-6 flex gap-3">
    <a href="/learn" class="rounded-md border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50">Curriculum</a>
    <a href="/review" class="rounded-md border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50">Review</a>
    <a href="/tutor" class="rounded-md border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50">Tutor</a>
  </nav>

  {#if data.user}
    <p class="mt-6 text-sm text-slate-600">
      Signed in as <span class="font-semibold">{data.user.email}</span> ·
      <a href="/account" class="text-teal-700 hover:underline">Your account</a>
    </p>
  {/if}
</main>
