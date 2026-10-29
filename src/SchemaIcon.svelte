<script lang="ts">
	import { IconRegistry, type Schema } from '@opensanctions/followthemoney';
	import { getSchemaCategory } from './schemaStyle';

	let { schema, size = 28 }: { schema: Schema; size?: number } = $props();

	const paths = $derived(IconRegistry.getSchemaIcon(schema));
	const category = $derived(getSchemaCategory(schema));
</script>

<span
	class="schema-icon"
	data-category={category}
	style="width: {size}px; height: {size}px"
>
	<svg
		viewBox="0 0 24 24"
		width={Math.round(size * 0.57)}
		height={Math.round(size * 0.57)}
		fill="currentColor"
	>
		{#each paths as d, i (i)}
			<path {d}></path>
		{/each}
	</svg>
</span>

<style>
	.schema-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		flex-shrink: 0;
	}

	.schema-icon[data-category='person'] {
		color: var(--schema-person-fg);
		background-color: var(--schema-person-bg);
	}

	.schema-icon[data-category='legalEntity'] {
		color: var(--schema-legalentity-fg);
		background-color: var(--schema-legalentity-bg);
	}

	.schema-icon[data-category='document'] {
		color: var(--schema-document-fg);
		background-color: var(--schema-document-bg);
	}

	.schema-icon[data-category='default'] {
		color: var(--schema-default-fg);
		background-color: var(--schema-default-bg);
	}
</style>
