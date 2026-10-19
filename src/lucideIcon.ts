import { setIcon } from 'obsidian';
import type { Attachment } from 'svelte/attachments';

export const lucideIcon =
	(name: string): Attachment<HTMLElement> =>
	(node) => {
		setIcon(node, name);
	};
