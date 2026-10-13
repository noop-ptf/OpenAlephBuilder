<script lang="ts">
  import type { Schema } from "@opensanctions/followthemoney";
  import { getSchemaCategory } from "./schemaStyle";
  import { type CardState } from "./entityCard";
  import EntityEditor from "./EntityEditor.svelte";

  let {
    card = $bindable(),
    schemata,
    index,
    dragging = false,
    dragOver = false,
    onremove,
    onhandlepointerdown,
  }: {
    card: CardState;
    schemata: Schema[];
    index: number;
    dragging?: boolean;
    dragOver?: boolean;
    onremove: () => void;
    onhandlepointerdown?: (event: PointerEvent) => void;
  } = $props();

  const category = $derived(
    card.entity ? getSchemaCategory(card.entity.schema) : "default",
  );
</script>

<article
  class="card"
  class:dragging
  class:drag-over={dragOver}
  data-category={category}
  data-card-index={index}
>
  <header>
    {#if onhandlepointerdown}
      <span
        class="drag-handle"
        role="button"
        tabindex="-1"
        aria-label="Drag to reorder"
        title="Drag to reorder"
        onpointerdown={onhandlepointerdown}>⠿</span
      >
    {/if}
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
    width: 360px;
    padding: 0.75em;
    border-radius: 8px;
    border-left: 4px solid var(--schema-default-fg);
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  .card.drag-over {
    outline: 2px dashed var(--schema-default-fg);
    outline-offset: 2px;
  }

  .card.dragging {
    opacity: 0.5;
  }

  .card[data-category="person"] {
    border-left-color: var(--schema-person-fg);
  }

  .card[data-category="legalEntity"] {
    border-left-color: var(--schema-legalentity-fg);
  }

  .card[data-category="document"] {
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

  .drag-handle {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.4em;
    height: 1.4em;
    color: var(--schema-default-fg);
    opacity: 0.6;
    cursor: grab;
    user-select: none;
  }

  .drag-handle:hover {
    opacity: 1;
  }

  .drag-handle:active {
    cursor: grabbing;
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
