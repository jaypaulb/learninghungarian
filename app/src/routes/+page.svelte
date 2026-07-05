<script lang="ts">
  let { data } = $props();
</script>

<main class="mx-auto max-w-3xl p-8">
  <h1 class="text-2xl font-bold text-teal-700">Learning Hungarian</h1>
  <p class="mt-2 text-slate-600">Platform foundation is running.</p>
  {#if data.user}
    <p class="mt-4 text-sm text-slate-600">
      Signed in as <span class="font-semibold">{data.user.email}</span> ·
      <a href="/account" class="text-teal-700 hover:underline">Your account</a>
    </p>
  {/if}
</main>
