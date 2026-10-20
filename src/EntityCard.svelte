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
	<header>
		<button
			type="button"
			class="remove"
			aria-label="Remove entity"
			onclick={onremove}>×</button
		>
	</header>

	<EntityEditor bind:card {schemata} />
</article>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		border-radius: 8px;
		border-left: 4px solid var(--schema-default-fg);
		background: #ffffff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		margin-inline: 0;
		padding: 8px 16px;
	}

	.card[data-category='person'] {
		border-left-color: var(--schema-person-fg);
	}

	.card[data-category='legalEntity'] {
		border-left-color: var(--schema-legalentity-fg);
	}

	.card[data-category='document'] {
		border-left-color: var(--schema-document-fg);
	}

	header {
		display: flex;
		align-items: center;
		gap: 0.4em;
	}

	header :global(.schema-select) {
		flex: 1;
		min-width: 0;
	}

	.remove {
		margin-left: auto;
		padding: 0.2em 0.5em;
		box-shadow: none;
		border: none;
		background: transparent;
		color: var(--schema-person-fg);
		font-size: 1.1em;
		line-height: 1;
	}

	@media (prefers-color-scheme: dark) {
		.card {
			background: #0f0f0f98;
		}
	}
</style>
