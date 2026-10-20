<script lang="ts">
	import { createAttachmentKey } from 'svelte/attachments';
	import type { Schema } from '@opensanctions/followthemoney';
	import CustomCombobox from './CustomCombobox.svelte';
	import SchemaIcon from './SchemaIcon.svelte';

	let {
		selectedSchema,
		schemata,
		handleSchemaChange,
		autofocus = false,
	}: {
		selectedSchema: string;
		schemata: Schema[];
		handleSchemaChange: (name: string) => void;
		autofocus?: boolean;
	} = $props();

	const inputProps = {
		placeholder: 'What kind of Entity is this?',
		[createAttachmentKey()]: (node: HTMLInputElement) => {
			if (autofocus) node.focus();
		},
	};

	const schemaItems = $derived(
		schemata.map((s) => ({ schema: s, value: s.name, label: s.label })),
	);
	function schemaForValue(value) {
		return schemata.find((s) => s.name === value);
	}
</script>

<CustomCombobox
	items={schemaItems}
	onValueChange={handleSchemaChange}
	value={selectedSchema}
	{inputProps}
>
	{#snippet valueIcon(value)}
		{#if value}
			<SchemaIcon schema={schemaForValue(value)} size={20} />
		{:else}
			<span class="schema-icon placeholder" aria-hidden="true"></span>
		{/if}
	{/snippet}
	{#snippet itemRow(item)}
		<SchemaIcon schema={item.schema} size={20} />{item.label}
	{/snippet}
</CustomCombobox>

<style>
	.schema-icon.placeholder {
		display: inline-flex;
		width: 20px;
		height: 20px;
		border-radius: 6px;
		flex-shrink: 0;
		border: 1px dashed rgba(127, 127, 127, 0.4);
	}
</style>
