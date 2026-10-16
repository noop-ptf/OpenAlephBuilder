<script lang="ts">
	import { createResource } from './store';
	import { onMount } from 'svelte';
	import type { OpenAlephCollection } from './types';

	type Props = {
		loadCollections: () => Promise<OpenAlephCollection[]>;
		selectedCollection: OpenAlephCollection | null;
	};
	let { loadCollections, selectedCollection = $bindable(null) }: Props =
		$props();

	const collections = createResource(() => loadCollections());

	// collection ids are only unique per instance, so key on both
	const keyOf = (c: OpenAlephCollection) => `${c.instanceId}:${c.id}`;

	onMount(() => collections.load());
</script>

{#if $collections.status === 'loading' && !$collections.data}
	<p>Loading…</p>
{:else if $collections.status === 'error' && !$collections.data}
	<p>
		Failed to load collections. <button onclick={collections.refresh}
			>Retry</button
		>
	</p>
{:else if $collections.data}
	<select
		class:stale={$collections.status === 'loading'}
		bind:value={
			() => (selectedCollection ? keyOf(selectedCollection) : ''),
			(key) =>
				(selectedCollection =
					$collections.data?.find((c) => keyOf(c) === key) ?? null)
		}
	>
		<option value="" disabled>Select collection...</option>
		{#each $collections.data as collection (keyOf(collection))}
			<option value={keyOf(collection)}>
				{collection.label}{collection.summary
					? ` (${collection.summary})`
					: undefined}
				{collection.instanceId.slice(0, 4)}
			</option>
		{/each}
	</select>
	<button onclick={collections.refresh}>Refresh</button>
{/if}
