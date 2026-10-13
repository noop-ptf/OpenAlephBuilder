<script lang="ts">
  import { onMount } from "svelte";
  import type { Property, Schema } from "@opensanctions/followthemoney";
  import { model } from "./ftm";
  import { getCardProperties, setCaption, type CardState } from "./entityCard";
  import AddedPropertyField from "./AddedPropertyField.svelte";
  import SchemaCombobox from "./SchemaCombobox.svelte";
  import PropertyChooserDialog from "./PropertyChooserDialog.svelte";

  let {
    card = $bindable(),
    schemata,
    onDelete,
  }: {
    card: CardState;
    schemata: Schema[];
    onDelete?: () => void;
  } = $props();

  // Schema → entity lifecycle. Guarded by a token so a rapid type-switch
  // can't let a stale createEntity() resolution clobber a newer one.
  let creationToken = 0;
  async function handleSchemaChange(name: string) {
    const schema = schemata.find((s) => s.name === name);
    if (!schema || schema === card.entity?.schema) return;
    const token = ++creationToken;
    const entity = await model.createEntity(schema);
    if (token !== creationToken) return;
    card.entity = entity;
    setCaption(card, card.caption); // carry the typed-so-far caption onto the new entity
    const { featured } = getCardProperties(schema);
    card.addedProps = featured.map((p) => ({ property: p, values: [] }));
  }

  const propertyLists = $derived(
    card.entity
      ? getCardProperties(card.entity.schema)
      : { featured: [], others: [] },
  );
  const availableOthers = $derived(
    propertyLists.others.filter(
      (p) => !card.addedProps.some((ap) => ap.property === p),
    ),
  );
  const requiredNames = $derived(new Set(card.entity?.schema.required ?? []));
  const captionRequired = $derived(
    card.entity ? requiredNames.has(card.entity.schema.caption[0]) : false,
  );

  function toggleProp(prop: Property) {
    const existing = card.addedProps.find((ap) => ap.property === prop);
    if (existing) {
      card.addedProps = card.addedProps.filter((ap) => ap !== existing);
    } else {
      card.addedProps.push({ property: prop, values: [] });
    }
  }

  function focusOnMount(node: HTMLInputElement, shouldFocus: boolean) {
    if (shouldFocus) node.focus();
  }
</script>

<input
  class="caption"
  type="text"
  placeholder="Name…"
  aria-required={captionRequired}
  value={card.caption}
  oninput={(e) => setCaption(card, e.currentTarget.value)}
  use:focusOnMount={card.autofocusCaption}
/>
<SchemaCombobox
  selectedSchema={card.entity?.schema.name}
  {schemata}
  {handleSchemaChange}
/>

{#if card.entity}
  {#each card.addedProps as ap, apIndex (ap.property.name)}
    <AddedPropertyField
      entity={card.entity}
      bind:ap={card.addedProps[apIndex]}
      required={requiredNames.has(ap.property.name)}
      onremove={() => toggleProp(ap.property)}
    />
  {/each}
  {#if availableOthers.length > 0}
    <PropertyChooserDialog
      schema={card.entity.schema}
      onSelectProperty={toggleProp}
    />
  {/if}
  {#if onDelete}
    <button onclick={onDelete}>Delete Entity</button>
  {/if}
{/if}

<style>
  .caption {
    width: 100%;
    padding: 0.35em 0.5em;
    font-size: 0.85em;
  }
</style>
