<script lang="ts">
  let { data } = $props();
</script>

<main class="mx-auto max-w-3xl p-8">
  <h1 class="text-2xl font-bold text-teal-700">Learning Hungarian</h1>
  <p class="mt-2 text-slate-600">Zero to B2, magyarul.</p>

  <nav class="mt-6 flex gap-3">
    <a href="/learn" class="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">Curriculum</a>
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
