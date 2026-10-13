<script lang="ts">
  import type { Entity } from "@opensanctions/followthemoney";
  import type { AddedProperty } from "./entityCard";
  import { syncProperty } from "./entityCard";
  import PropertyField from "./PropertyField.svelte";

  let {
    entity,
    ap = $bindable(),
    required = false,
    onremove,
  }: {
    entity: Entity;
    ap: AddedProperty;
    required?: boolean;
    onremove: () => void;
  } = $props();

  $effect(() => {
    ap.values;
    syncProperty(entity, ap);
  });
</script>

<div class="added-field">
  <PropertyField property={ap.property} {required} bind:values={ap.values} />
  <button type="button" class="field-remove" onclick={onremove}
    >Remove field</button
  >
</div>

<style>
  .added-field {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
  }

  .added-field :global(fieldset) {
    border: none;
    padding: 0;
    margin: 0;
    min-width: 0;
  }

  .added-field :global(input),
  .added-field :global(select),
  .added-field :global(textarea) {
    width: 100%;
    box-sizing: border-box;
  }

  .field-remove {
    align-self: flex-start;
    font-size: 0.75em;
    padding: 0.2em 0.5em;
    box-shadow: none;
  }
</style>
