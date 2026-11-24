/** One option in a `<Select>`. */
export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

/** Item height (30px) plus the 2px gap between items. */
const ITEM_PITCH = 32;
/** The menu's 4px padding at the top and bottom. */
const MENU_PADDING = 4;

/** The height of a menu showing exactly `count` items, with no gap after the last. */
export function menuHeightForItems(count: number): number {
	return MENU_PADDING * 2 + count * ITEM_PITCH - 2;
}
