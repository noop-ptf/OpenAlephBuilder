<script lang="ts">
  import { createResource } from "./store";
  import { onMount } from "svelte";
	import type { OpenAlephCollection } from "./types";

  type Props = {
	  loadCollections: () => Promise<OpenAlephCollection[]>,
    selected: OpenAlephCollection["id"] | null;
  };
  let { loadCollections, selected = $bindable() }: Props = $props();

  const collections = createResource(() => loadCollections());

  onMount(() => collections.load());
</script>

{#if $collections.status === "loading" && !$collections.data}
  <p>Loading…</p>
{:else if $collections.status === "error" && !$collections.data}
  <p>
    Failed to load collections. <button onclick={collections.refresh}
      >Retry</button
    >
  </p>
{:else if $collections.data}
  <select class:stale={$collections.status === "loading"} bind:value={selected}>
    {#each $collections.data as collection (collection.id)}
      <option value={collection.id}>
        {collection.label}{collection.summary
          ? ` (${collection.summary})`
          : undefined} {collection.instanceId.slice(0, 4)}
      </option>
    {/each}
  </select>
  <button onclick={collections.refresh}>Refresh</button>
{/if}
