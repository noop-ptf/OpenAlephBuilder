<script
  lang="ts"
  generics="T extends { name: string; label: string; description: string | null }"
>
  type Props = {
    groupedItems: { [key: string]: T[] };
    groupLabels: { [key: string]: string };
    itemClickHandler: (item: T) => void;
  };
  let { groupedItems, groupLabels, itemClickHandler }: Props = $props();
  $inspect(groupedItems);

  // TODO: take JS/CSS code from
</script>

{#each Object.keys(groupedItems) as group (group)}
  <div class="group">{groupLabels[group] || group}</div>
  <ul>
    {#each groupedItems[group] as item (item.name)}
      <li>
        <button onclick={() => itemClickHandler(item)}>
          <span class="label">{item.label}</span>
          <span class="description">{item.description}</span>
        </button>
      </li>
    {/each}
  </ul>
{/each}

<style>
  .group {
    border-bottom: 1px solid #eceae5;
    text-transform: uppercase;
  }
  ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    align-items: stretch;
  }
  li {
    list-style: none;
    border-radius: 4px;
  }
  button {
    display: block;
    width: 100%;
    padding: 8px;
    border: none;
    border-radius: 4px;
    background: none;
    text-align: left;
    cursor: pointer;
  }
  button:hover {
    background-color: #f6f5f2;
    border-radius: 4px;
  }
  .label,
  .description {
    display: block;
  }
</style>
