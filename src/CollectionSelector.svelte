<script lang="ts">
	import { lucideIcon } from './lucideIcon';
	import { createResource } from './store';
	import { onMount } from 'svelte';
	import type {
		OpenAlephCollection,
		OpenAlephInstanceSettings,
	} from './types';

	type Props = {
		loadCollections: () => Promise<OpenAlephCollection[]>;
		getInstanceSettings: (id: string) => OpenAlephInstanceSettings;
		selectedCollection: OpenAlephCollection | null;
	};
	let {
		loadCollections,
		getInstanceSettings,
		selectedCollection = $bindable(null),
	}: Props = $props();

	const collections = createResource(() => loadCollections());

	// collection ids are only unique per instance, so key on both
	const keyOf = (c: OpenAlephCollection) => `${c.instanceId}:${c.id}`;

	onMount(() => collections.load());
</script>

<div class="wrapper">
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
			class="select"
			bind:value={
				() => (selectedCollection ? keyOf(selectedCollection) : ''),
				(key) =>
					(selectedCollection =
						$collections.data?.find((c) => keyOf(c) === key) ??
						null)
			}
		>
			<option value="" disabled>Select collection...</option>
			{#each $collections.data as collection (keyOf(collection))}
				<option value={keyOf(collection)}>
					{collection.label} |
					{getInstanceSettings(collection.instanceId)?.name}
				</option>
			{/each}
		</select>
		<button
			class="clickable-icon"
			aria-label="Reload collections"
			onclick={collections.refresh}
			{@attach lucideIcon('list-restart')}
		></button>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
	}
	.select {
		flex-grow: 1;
	}
</style>
