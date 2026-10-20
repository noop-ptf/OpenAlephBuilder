<script lang="ts">
	import Dialog from './Dialog.svelte';
	import GroupedPropertyChooser from './GroupedPropertyChooser.svelte';
	import { getGroupedProperty, FIELD_GROUPS } from './ftm';
	import { fuzzyFilter } from './fuzzy';

	let { schema, onSelectProperty } = $props();

	const groupedProperties = $derived(getGroupedProperty(schema));
	let open = $state(false);
	let filterInput = $state<HTMLInputElement>();
	let searchValue = $state('');
	const filteredGroups = $derived(
		Object.fromEntries(
			Object.entries(groupedProperties)
				.map(
					([g, props]) =>
						[g, fuzzyFilter(props, searchValue)] as const,
				)
				.filter(([, props]) => props.length > 0),
		),
	);
</script>

<Dialog
	buttonText={'Add Property'}
	bind:open
	contentProps={{
		onOpenAutoFocus: (e) => {
			e.preventDefault();
			filterInput?.focus();
		},
		style: 'height: 80%',
	}}
>
	{#snippet title()}
		Property Selection
	{/snippet}
	{#snippet description()}
		Choose a property to add to the entity.
	{/snippet}
	<input type="text" bind:this={filterInput} bind:value={searchValue} />
	<div class="scroll">
		<GroupedPropertyChooser
			groupedItems={filteredGroups}
			groupLabels={FIELD_GROUPS.labels}
			itemClickHandler={(p) => {
				onSelectProperty(p);
				open = false;
			}}
		></GroupedPropertyChooser>
	</div>
</Dialog>

<style>
	.scroll {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}
</style>
