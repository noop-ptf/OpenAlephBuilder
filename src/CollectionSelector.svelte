<script lang="ts">
  import { type Collection } from "$lib/openaleph/types";
  import { HttpClient, type OpenAlephInstanceSettings } from "$lib/client/http";
  import { createResource } from "$lib/store";
  import { onMount } from "svelte";

  type Props = {
    settings: OpenAlephInstanceSettings;
    selected: Collection["id"] | null;
  };
  let { settings, selected = $bindable() }: Props = $props();

  async function availableCollections(): Promise<Collection[]> {
    const client = new HttpClient(settings);
    let collections = await client.getCollections();
    console.log("available");
    console.log(collections);
    return collections;
  }

  const collections = createResource(() => availableCollections());

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
          : undefined}
      </option>
    {/each}
  </select>
  <button onclick={collections.refresh}>Refresh</button>
{/if}
