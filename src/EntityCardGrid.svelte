<script lang="ts">
	import type { Schema } from '@opensanctions/followthemoney';
	import { listEntitySchemata } from './ftm';
	import { createCardState, type CardState } from './entityCard';
	import EntityCard from './EntityCard.svelte';
	import CollectionSelector from './CollectionSelector.svelte';
	import { type OpenAlephCollection } from './types';
	import type { Entity } from '@opensanctions/followthemoney';

	let {
		loadCollections,
		bulkEntityUpload,
	}: {
		loadCollections: () => Promise<OpenAlephCollection[]>;
		bulkEntityUpload: (
			entities: Entity[],
			collection: OpenAlephCollection,
		) => void;
	} = $props();
	const schemata: Schema[] = listEntitySchemata();

	// The shared store array: only ever mutated in place, never reassigned.
	let cards = $state<CardState[]>([]);
	let dragIndex = $state<number | null>(null);
	let overIndex = $state<number | null>(null);

	function addCard() {
		cards.push(createCardState(true));
	}

	function removeCard(index: number) {
		cards.splice(index, 1);
	}

	// Native HTML5 drag-and-drop (draggable/dataTransfer) is unreliable across
	// webviews — notably WKWebView, which Tauri uses on macOS, has long-standing
	// gaps in its HTML5 DnD support. Pointer events don't depend on the browser's
	// drag implementation at all, so they behave the same in a plain browser and
	// inside the Tauri shell.
	function startDrag(index: number) {
		return (event: PointerEvent) => {
			event.preventDefault();
			dragIndex = index;
			overIndex = index;
			window.addEventListener('pointermove', handlePointerMove);
			window.addEventListener('pointerup', handlePointerUp);
		};
	}

	function handlePointerMove(event: PointerEvent) {
		const target = document.elementFromPoint(event.clientX, event.clientY);
		const cardEl = target?.closest<HTMLElement>('[data-card-index]');
		if (cardEl) overIndex = Number(cardEl.dataset.cardIndex);
	}

	function handlePointerUp() {
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
		if (
			dragIndex !== null &&
			overIndex !== null &&
			dragIndex !== overIndex
		) {
			const [moved] = cards.splice(dragIndex, 1);
			cards.splice(overIndex, 0, moved);
		}
		dragIndex = null;
		overIndex = null;
	}

	let selectedCollection: OpenAlephCollection | null = $state(null);
	$inspect(selectedCollection);

	function postEntitiesToSelectedCollection() {
		let entities = cards
			.map((card) => card.entity)
			.filter((entity) => entity !== undefined);
		if (selectedCollection) {
			bulkEntityUpload(entities, selectedCollection);
		}
	}
</script>

<div class="grid-wrap">
	<CollectionSelector {loadCollections} bind:selectedCollection />
	<div class="grid">
		{#each cards as card, index (card.key)}
			<EntityCard
				bind:card={cards[index]}
				{schemata}
				{index}
				dragging={dragIndex === index}
				dragOver={overIndex === index && dragIndex !== index}
				onremove={() => removeCard(index)}
				onhandlepointerdown={startDrag(index)}
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
	<button onclick={postEntitiesToSelectedCollection}
		>Post to collection {selectedCollection?.id}</button
	>
</div>

<style>
	.grid-wrap {
		width: 100%;
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.grid {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.card.ghost {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 260px;
		min-height: 120px;
		gap: 0.3em;
		border-radius: 8px;
		border: 2px dashed rgba(127, 127, 127, 0.4);
		background: transparent;
		box-shadow: none;
		opacity: 0.6;
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
