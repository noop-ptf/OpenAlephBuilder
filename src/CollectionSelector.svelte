<script lang="ts">
	import { Notice } from 'obsidian';
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

	function refreshWithFeedback(): void {
		new Notice('Reloading Collections...');
		collections.refresh();
	}
</script>

<div class="wrapper">
	{#if $collections.status === 'loading' && !$collections.data}
		<p>Loading…</p>
	{:else if $collections.status === 'error' && !$collections.data}
		<p>
			Failed to load collections.
			<button onclick={refreshWithFeedback}>Retry</button>
		</p>
	{:else if $collections.data}
		{#if $collections.data.length === 0}
			<p>
				No collections found. Configure an instance in the settings
				where you have a dataset/investigation with write permissions.
				<button onclick={refreshWithFeedback}>Retry</button>
			</p>
		{:else}
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
				aria-label="Refresh collections"
				onclick={refreshWithFeedback}
				{@attach lucideIcon('refresh-cw')}
			></button>
		{/if}
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		gap: 12px;
	}
	.select {
		flex-grow: 1;
	}
</style>
