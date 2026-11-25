/** Modals.sketchframe: dialog modals are 400px wide. */
export const DIALOG_WIDTH = 400;

/** Modals.md: the space kept between a sheet and the edges of a small viewport. */
export const SHEET_VIEWPORT_GAP = 16;

/** Arguments passed to a `<Sheet>`'s footer action snippets. */
export interface SheetActionArgs {
	/** Closes the sheet as a cancellation, the same as its close button. */
	close: () => void;
}

/** Elements a person can Tab to, in document order. */
const TABBABLE =
	'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

export function firstTabbable(root: Element | null): HTMLElement | null {
	if (!root) return null;
	for (const el of root.querySelectorAll<HTMLElement>(TABBABLE)) {
		if (el.closest('[inert], [hidden]')) continue;
		if (el.getClientRects().length === 0) continue;
		return el;
	}
	return null;
}

/**
 * Modals.md, Dialog Modals: Tab or the arrow keys move between actions. Moves
 * focus to the previous or next button in `row`, wrapping at the ends.
 */
export function moveBetweenActions(event: KeyboardEvent, row: HTMLElement): void {
	const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key];
	if (!step) return;
	const actions = [...row.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')];
	const index = actions.indexOf(document.activeElement as HTMLElement);
	if (index === -1 || actions.length < 2) return;
	event.preventDefault();
	actions[(index + step + actions.length) % actions.length].focus();
}
