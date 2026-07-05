<script lang="ts">
  let { data } = $props();
  let confirming = $state(false);
</script>

<main class="mx-auto max-w-3xl p-8">
  <a href="/" class="text-sm text-teal-700 hover:underline">&larr; Back</a>
  <h1 class="mt-2 text-2xl font-bold text-teal-700">Your account</h1>

  <dl class="mt-6 space-y-2 rounded-xl bg-white p-6 shadow-md">
    <div>
      <dt class="text-sm font-semibold text-slate-500">Email</dt>
      <dd class="text-slate-700">{data.user.email}</dd>
    </div>
    <div>
      <dt class="text-sm font-semibold text-slate-500">Member since</dt>
      <dd class="text-slate-700">{new Date(data.user.createdAt).toLocaleDateString()}</dd>
    </div>
  </dl>

  <section class="mt-8 rounded-xl bg-white p-6 shadow-md">
    <h2 class="text-lg font-semibold text-slate-700">Your data</h2>
    <p class="mt-1 text-sm text-slate-600">
      Download everything we store about you, or delete your account entirely.
    </p>
    <div class="mt-4 flex gap-3">
      <a
        href="/account/export"
        class="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >Export my data</a
      >
      {#if !confirming}
        <button
          onclick={() => (confirming = true)}
          class="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
          >Delete my account</button
        >
      {:else}
        <form method="POST" action="?/delete">
          <button
            type="submit"
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >Really delete — this cannot be undone</button
          >
        </form>
        <button onclick={() => (confirming = false)} class="px-2 text-sm text-slate-500 hover:underline"
          >Cancel</button
        >
      {/if}
    </div>
  </section>
</main>
