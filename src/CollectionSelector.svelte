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
		openPluginSettings: () => void;
		selectedCollection: OpenAlephCollection | null;
	};
	let {
		loadCollections,
		getInstanceSettings,
		openPluginSettings,
		selectedCollection = $bindable(null),
	}: Props = $props();

	const collections = createResource(() => loadCollections());

	// collection ids are only unique per instance, so key on both
	const keyOf = (c: OpenAlephCollection) => `${c.instanceId}:${c.id}`;

	onMount(() => collections.load());

	function refreshWithFeedback(): void {
		new Notice('Reloading investigations...');
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
			<div class="error">
				<p>
					No investigations found. Configure an instance in the
					settings where you have an investigation with write
					permissions.
				</p>
				<button onclick={openPluginSettings}>Open Settings</button>
				<button onclick={refreshWithFeedback}>Retry</button>
			</div>
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
				<option value="" disabled>Select investigation...</option>
				{#each $collections.data as collection (keyOf(collection))}
					<option value={keyOf(collection)}>
						{collection.label} |
						{getInstanceSettings(collection.instanceId)?.name}
					</option>
				{/each}
			</select>
			<button
				class="clickable-icon"
				aria-label="Refresh investigations"
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
	.error {
		border-radius: 8px;
		border: 1px solid var(--color-red);
		padding: 8px 16px 16px 16px;
	}
</style>
