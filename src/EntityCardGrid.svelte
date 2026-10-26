<script lang="ts">
	import { Notice } from 'obsidian';
	import type { Schema } from '@opensanctions/followthemoney';
	import { listEntitySchemata } from './ftm';
	import { createCardState, type CardState } from './entityCard';
	import EntityCard from './EntityCard.svelte';
	import CollectionSelector from './CollectionSelector.svelte';
	import type {
		OpenAlephCollection,
		OpenAlephInstanceSettings,
	} from './types';
	import type { Entity } from '@opensanctions/followthemoney';

	let {
		loadCollections,
		bulkEntityUpload,
		validateEntityUpload,
		getInstanceSettings,
	}: {
		loadCollections: () => Promise<OpenAlephCollection[]>;
		bulkEntityUpload: (
			entities: Entity[],
			collection: OpenAlephCollection,
		) => void;
		validateEntityUpload: (
			entities: Entity[],
			collection: OpenAlephCollection,
		) => void;
		getInstanceSettings: (id: string) => OpenAlephInstanceSettings;
	} = $props();
	const schemata: Schema[] = listEntitySchemata();

	// The shared store array: only ever mutated in place, never reassigned.
	let cards = $state<CardState[]>([]);

	function addCard() {
		cards.push(createCardState(true));
	}

	function removeCard(index: number) {
		cards.splice(index, 1);
	}

	let selectedCollection: OpenAlephCollection | null = $state(null);
	$inspect(selectedCollection);

	function postEntitiesToSelectedCollection() {
		let entities = cards
			.map((card) => card.entity)
			.filter((entity) => entity !== undefined);
		if (selectedCollection) {
			new Notice(
				`Posting ${entities.length} entities to ${selectedCollection.label}`,
			);
			bulkEntityUpload(entities, selectedCollection);
		}
	}
	function validateUploadSelectedCollection() {
		let entities = cards
			.map((card) => card.entity)
			.filter((entity) => entity !== undefined);
		if (selectedCollection) {
			new Notice(`Verifying entities in ${selectedCollection.label}`);
			validateEntityUpload(entities, selectedCollection);
		}
	}
</script>

<h2>Open Aleph FtM Builder</h2>
<h3>Create entities</h3>
<div class="entities">
	{#each cards as card, index (card.key)}
		<EntityCard
			bind:card={cards[index]}
			{schemata}
			onremove={() => removeCard(index)}
		/>
	{/each}

	<button
		type="button"
		class="card ghost"
		onclick={addCard}
		aria-label="Add entity"
	>
		<span class="plus" aria-hidden="true">+</span>
		<span>Add entity</span>
	</button>
</div>
<h3>Select a collection</h3>
<p>Where do you want to create Follow the Money entities?</p>
<CollectionSelector
	{loadCollections}
	{getInstanceSettings}
	bind:selectedCollection
/>
<h3>Upload/Export</h3>
{#if !selectedCollection}
	<p>Select a collection to upload entities</p>
{:else if cards.length === 0}
	<p>Create an entity to upload</p>
{:else}
	<button onclick={postEntitiesToSelectedCollection}
		>Upload {cards.length}
		{cards.length == 1 ? 'entity' : 'entities'} to OpenAleph</button
	>
	<button onclick={validateUploadSelectedCollection}>Verify upload</button>
{/if}

<style>
	.entities {
		display: flex;
		flex-direction: column;
		justify-items: stretch;
		gap: 12px;
		margin-block: 12px;
	}

	.card.ghost {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 120px;
		gap: 0.3em;
		border-radius: 8px;
		border: 2px dashed rgba(127, 127, 127, 0.4);
		background: transparent;
		box-shadow: none;
		opacity: 0.6;
		margin-inline: 0;
	}

	.card.ghost:hover,
	.card.ghost:focus-visible {
		opacity: 1;
		border-color: var(--schema-default-fg);
	}

	.card.ghost .plus {
		font-size: 1.8em;
		line-height: 1;
	}
</style>
