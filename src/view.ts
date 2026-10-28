import { ItemView, WorkspaceLeaf } from 'obsidian';
import { mount, unmount } from 'svelte';
import OpenAlephPlugin from './main';
import EntityCardGrid from './EntityCardGrid.svelte';
import type { Entity } from '@opensanctions/followthemoney';
import type { OpenAlephCollection } from './types';

export const VIEW_TYPE_OPENALEPH_BUILDER = 'openaleph-builder-view';

export class OpenAlephBuilderView extends ItemView {
	// A variable to hold on to the Counter instance mounted in this ItemView.
	grid: ReturnType<typeof EntityCardGrid> | undefined;
	private plugin: OpenAlephPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: OpenAlephPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return VIEW_TYPE_OPENALEPH_BUILDER;
	}

	getDisplayText(): string {
		return 'Federated OpenAleph Builder';
	}

	getIcon(): string {
		return 'factory';
	}

	async onOpen(): Promise<void> {
		this.grid = mount(EntityCardGrid, {
			target: this.contentEl,
			props: {
				loadCollections: () => this.plugin.loadCollections(),
				bulkEntityUpload: (
					entities: Entity[],
					collection: OpenAlephCollection,
				) => this.plugin.bulkEntityUpload(entities, collection),
				validateEntityUpload: (
					entities: Entity[],
					collection: OpenAlephCollection,
				) => this.plugin.validateEntityUpload(entities, collection),
				getInstanceSettings: (id: string) =>
					this.plugin.getInstanceSettings(id),
				openPluginSettings: () => this.plugin.openPluginSettings(),
			},
		});
	}

	async onClose(): Promise<void> {
		if (this.grid) {
			// Remove the EntityCardGrid from the ItemView.
			await unmount(this.grid);
			this.grid = undefined;
		}
	}
}
