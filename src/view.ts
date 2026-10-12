import { ItemView, WorkspaceLeaf } from 'obsidian';
// Import the Counter Svelte component and the `mount` and `unmount` methods.
import Counter from './Counter.svelte';
import { mount, unmount } from 'svelte';
import OpenAlephPlugin from './main';

export const VIEW_TYPE_OPENALEPH_BUILDER = 'openaleph-builder-view';

export class OpenAlephBuilderView extends ItemView {
	// A variable to hold on to the Counter instance mounted in this ItemView.
	counter: ReturnType<typeof Counter> | undefined;
	constructor(leaf: WorkspaceLeaf, _plugin: OpenAlephPlugin) {
		super(leaf);
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
		this.counter = mount(Counter, {
			target: this.contentEl,
			props: {
				startCount: 5,
			},
		});
		// Since the component instance is typed, the exported `increment` method is known to TypeScript.
		this.counter.increment();
	}

	async onClose(): Promise<void> {
		if (this.counter) {
			// Remove the Counter from the ItemView.
			unmount(this.counter);
		}
	}
}
