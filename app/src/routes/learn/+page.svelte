<script lang="ts">
  let { data } = $props();
  const statusLabel: Record<string, { text: string; cls: string }> = {
    draft: { text: 'draft', cls: 'bg-amber-100 text-amber-800' },
    reviewed: { text: 'AI-drafted, provisional', cls: 'bg-sky-100 text-sky-800' },
    community_verified: { text: 'community-verified', cls: 'bg-emerald-100 text-emerald-800' }
  };
</script>

<main class="mx-auto max-w-3xl p-8">
  <a href="/" class="text-sm text-teal-700 hover:underline">&larr; Home</a>
  <h1 class="mt-2 text-2xl font-bold text-teal-700">Curriculum</h1>
  <p class="mt-1 text-slate-600">Zero to B2, one tier at a time.</p>

  {#each data.tiers as tier}
    <section class="mt-8">
      <h2 class="text-xl font-bold text-slate-700">{tier.tier}</h2>
      {#each tier.modules as mod}
        <div class="mt-4 rounded-xl bg-white p-6 shadow-md">
          <h3 class="text-lg font-semibold text-slate-700">{mod.title}</h3>
          {#if mod.description}<p class="mt-1 text-sm text-slate-600">{mod.description}</p>{/if}
          <ul class="mt-3 divide-y divide-slate-100">
            {#each mod.lessons as lesson}
              <li class="flex items-center justify-between py-2">
                <span>
                  <a href="/learn/{lesson.id}" class="text-teal-700 hover:underline">{lesson.title}</a>
                  {#if lesson.progress === 'completed'}<span class="ml-1 text-emerald-600" title="completed">✓</span>
                  {:else if lesson.progress === 'in_progress'}<span class="ml-1 text-amber-500" title="in progress">…</span>{/if}
                </span>
                <span class="rounded-full px-2 py-0.5 text-xs {statusLabel[lesson.status].cls}"
                  >{statusLabel[lesson.status].text}</span
                >
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>
  {:else}
    <p class="mt-8 text-slate-500">No content imported yet.</p>
  {/each}
</main>
