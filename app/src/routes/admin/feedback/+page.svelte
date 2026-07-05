<script lang="ts">
  let { data } = $props();
  const statusCls: Record<string, string> = {
    new: 'bg-amber-100 text-amber-800',
    triaged: 'bg-sky-100 text-sky-800',
    accepted: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-slate-200 text-slate-600'
  };
</script>

<main class="mx-auto max-w-4xl p-8">
  <a href="/" class="text-sm text-teal-700 hover:underline">&larr; Home</a>
  <h1 class="mt-2 text-2xl font-bold text-teal-700">Feedback triage</h1>
  <p class="text-sm text-slate-500">
    {data.rows.length} most recent. Resolving notifies consenting submitters (log-only until an email provider is wired).
  </p>

  <div class="mt-6 space-y-4">
    {#each data.rows as row}
      <div class="rounded-xl bg-white p-4 shadow-md" data-testid="feedback-row">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-slate-400"
            >{new Date(row.createdAt).toLocaleString()} · {row.lessonId ?? row.exerciseId ?? 'general'}
            v{row.contentVersion ?? '?'} · {row.email ?? 'deleted user'}
            {#if row.consent === 1}· 📧 wants outcome{/if}
            {#if row.githubIssue}· <a class="text-teal-700 hover:underline" href="https://github.com/jaypaulb/learninghungarian/issues/{row.githubIssue}">#{row.githubIssue}</a>{/if}
          </span>
          <span class="rounded-full px-2 py-0.5 text-xs {statusCls[row.status]}">{row.status}</span>
        </div>
        <p class="mt-2 whitespace-pre-wrap text-sm text-slate-700">{row.message}</p>
        {#if row.status === 'new' || row.status === 'triaged'}
          <form method="POST" action="?/resolve" class="mt-3 flex flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={row.id} />
            <input name="note" placeholder="note to submitter (optional)" class="w-64 rounded-md border border-slate-300 px-2 py-1 text-sm" />
            <button name="decision" value="accepted" class="rounded-md bg-emerald-600 px-3 py-1 text-sm font-semibold text-white hover:bg-emerald-700">Accept</button>
            <button name="decision" value="rejected" class="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">Reject</button>
          </form>
        {/if}
      </div>
    {:else}
      <p class="text-slate-500">No feedback yet.</p>
    {/each}
  </div>
</main>
