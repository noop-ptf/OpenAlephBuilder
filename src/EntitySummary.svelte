<script lang="ts">
	import { type CardState } from './entityCard';
	let {
		card,
	}: {
		card: CardState;
	} = $props();
</script>

{#if card.entity}
	<ul>
		{#each card.addedProps as ap (ap.property.name)}
			{#if ap.values.length > 0}
				<li>
					<ul>
						{#each ap.values as value}
							<li>{value}</li>
						{/each}
					</ul>
				</li>
			{/if}
		{/each}
	</ul>
{/if}
