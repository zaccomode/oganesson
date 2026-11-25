import { getContext, setContext } from 'svelte';

/** Toolbars.md: regular (the default) or large. */
export type ToolbarSize = 'regular' | 'large';

export interface ToolbarContext {
	readonly size: ToolbarSize;
}

const KEY = Symbol('oganesson-toolbar');

/**
 * Set by `<Toolbar>` for its controls. Oganesson buttons inside a toolbar join
 * its roving focus (Bits UI `Toolbar.Button`/`Toolbar.Link`), so the arrow keys
 * move between them and the toolbar is a single tab stop.
 *
 * Pass `null` to cut a subtree off from the toolbar, e.g. a menu's items, which
 * are portalled out of the toolbar but still sit inside it in the component tree.
 */
export function setToolbarContext(context: ToolbarContext | null): void {
	setContext(KEY, context);
}

export function getToolbarContext(): ToolbarContext | null {
	return getContext<ToolbarContext | null | undefined>(KEY) ?? null;
}

/** Toolbars.sketchframe: the group container for each size. */
export const toolbarGroupMetrics = {
	regular: { radius: 10, padding: 2, gap: 2 },
	large: { radius: 12, padding: 4, gap: 4 }
} as const satisfies Record<ToolbarSize, { radius: number; padding: number; gap: number }>;
