<script lang="ts">
	import type { Schema } from '@opensanctions/followthemoney';
	import { getSchemaCategory } from './schemaStyle';
	import { type CardState } from './entityCard';
	import EntityEditor from './EntityEditor.svelte';

	let {
		card = $bindable(),
		schemata,
		onremove,
	}: {
		card: CardState;
		schemata: Schema[];
		onremove: () => void;
	} = $props();

	const category = $derived(
		card.entity ? getSchemaCategory(card.entity.schema) : 'default',
	);
</script>

<article class="card" data-category={category}>
	<button
		type="button"
		class="remove"
		aria-label="Remove entity"
		onclick={onremove}>×</button
	>

	<EntityEditor bind:card {schemata} />
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		border-radius: 8px;
		background: var(--background-primary);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		margin-inline: 0;
		padding: 16px;
		position: relative;
	}

	button {
		position: absolute;
		top: 0px;
		right: 5px;
	}

	.remove {
		margin-left: auto;
		padding: 0.2em 0.5em;
		box-shadow: none;
		border: none;
		background: transparent;
		font-size: 1.1em;
		line-height: 1;
	}
</style>
