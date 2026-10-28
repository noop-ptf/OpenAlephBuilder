<script lang="ts">
	import { lucideIcon } from './lucideIcon';
	import type { Property } from '@opensanctions/followthemoney';
	import CustomCombobox from './CustomCombobox.svelte';
	import { createAttachmentKey } from 'svelte/attachments';
	import PropertyInput from './PropertyInput.svelte';

	let {
		property,
		values = $bindable(),
		required = false,
		debug = false,
	}: {
		property: Property;
		values: string[];
		required?: boolean;
		debug?: boolean;
	} = $props();

	const enumValues = $derived(
		Array.from(property.type.values).map(([k, v]) => ({
			value: k,
			label: v,
		})),
	);

	// Properties whose values realistically never repeat for a single entity,
	// even though FtM itself imposes no limit on any property (see EntityForm).
	// Hides add/remove for these so the form doesn't invite meaningless
	// duplicate rows.
	// const SINGLE_VALUE_TYPES = new Set(["date", "number", "gender"]);
	// const isMultiValue = !SINGLE_VALUE_TYPES.has(property.type.name);

	function addValue() {
		values.push('');
	}

	function removeValue(index: number) {
		values.splice(index, 1);
	}
	function focusOnMount(node: HTMLInputElement | HTMLTextAreaElement) {
		node.focus();
	}
</script>

<fieldset>
	<legend>
		{property.label}{#if required}<span class="required" aria-hidden="true">
				*</span
			>{/if}
		{#if debug}({property.type.label}){/if}
		{#if property.description}
			<span
				class="info-hover"
				aria-label={property.description}
				{@attach lucideIcon('info')}
			></span>
		{/if}
	</legend>
	<div class="values">
		{#each values as _, i}
			<!-- FtM has 20 property types; only country/gender/language/topic (enum,
           via .values) and date/number/url/email/phone/text/json/html get a
           dedicated widget here. Everything else (address, checksum,
           identifier, ip, mimetype, name, string) falls through to plain text
           below. entity never reaches this component (filtered out in
           EntityForm). -->
			<div
				class="value"
				onfocusout={(e) => {
					if (
						!e.currentTarget.contains(
							e.relatedTarget as Node | null,
						)
					) {
						if (!values[i]) {
							removeValue(i);
						}
					}
				}}
			>
				{#if enumValues.length > 0}
					<CustomCombobox
						items={enumValues}
						bind:value={values[i]}
						inputProps={{ [createAttachmentKey()]: focusOnMount }}
					>
						{#snippet itemRow(item)}
							{item.label}
						{/snippet}
					</CustomCombobox>
				{:else if property.type.name === 'text' || property.type.name === 'json' || property.type.name === 'html'}
					<textarea bind:value={values[i]} {@attach focusOnMount}
					></textarea>
				{:else}
					<PropertyInput
						name={property.name}
						type={property.type.name}
						bind:value={values[i]}
					/>
				{/if}
				<button
					type="button"
					class="remove"
					onclick={() => removeValue(i)}>×</button
				>
			</div>
		{/each}
		<button type="button" class="add" onclick={addValue}>+ Add</button>
	</div>
</fieldset>

<style>
	.required {
		color: crimson;
	}
	.values {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.value {
		display: inline-flex;
		border: 1px solid;
		gap: 4px;
		background: var(--accentsoft);
		border: 1px solid #d9d3ea;
		border-radius: 8px;
		padding: 4px 4px 4px 8px;
	}
	.value .remove {
		all: unset;
	}
	.values .add {
		all: unset;
		color: var(--icon-color);
		padding: 4px;
	}
	.info-hover {
		color: var(--icon-color);
		padding-left: 2px;
	}
</style>
