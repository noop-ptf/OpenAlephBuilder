import { Plugin, Notice, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, OpenAlephSettingTab } from './settings';
import type { OpenAlephPluginSettings } from './types';
import { OpenAlephBuilderView, VIEW_TYPE_OPENALEPH_BUILDER } from './view';

export interface ResizableSidebarSplit {
	collapsed: boolean;
	size: number;
	containerEl: HTMLElement;
	setSize(size: number): void;
	expand(): void;
	collapse(): void;
}

export default class OpenAlephPlugin extends Plugin {
	settings!: OpenAlephPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new OpenAlephSettingTab(this.app, this));

		this.registerView(
			VIEW_TYPE_OPENALEPH_BUILDER,
			(leaf) => new OpenAlephBuilderView(leaf, this),
		);

		this.addRibbonIcon(
			'factory',
			'OpenAleph Builder',
			(_evt: MouseEvent) => {
				this.activateView().catch((err: unknown) => {
					const message =
						err instanceof Error ? err.message : String(err);
					new Notice(message);
				});
			},
		);

		this.addCommand({
			id: 'search-openaleph-instances',
			name: 'Open search view',
			callback: () => this.activateView(),
		});
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<OpenAlephPluginSettings>,
		);
	}

	async activateView(): Promise<void> {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null =
			workspace.getLeavesOfType(VIEW_TYPE_OPENALEPH_BUILDER)[0] ?? null;

		if (!leaf) {
			leaf = workspace.getLeftLeaf(false);
			if (!leaf) return;
			await leaf.setViewState({
				type: VIEW_TYPE_OPENALEPH_BUILDER,
				active: true,
			});
		}

		const leftSplit =
			workspace.leftSplit as unknown as ResizableSidebarSplit;

		if (leftSplit?.collapsed) {
			leftSplit.expand();
		}

		await workspace.revealLeaf(leaf);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
