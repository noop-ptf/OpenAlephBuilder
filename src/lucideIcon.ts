import { setIcon } from 'obsidian';
import type { Attachment } from 'svelte/attachments';

// TODO: This is a misnomer. I learned, that Obsidian also has custom
// icons, like 'right-triangle', which are also accessible via `setIcon`.
export const lucideIcon =
	(name: string): Attachment<HTMLElement> =>
	(node) => {
		setIcon(node, name);
	};
