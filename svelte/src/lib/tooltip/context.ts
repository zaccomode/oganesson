import { getContext, setContext } from 'svelte';

const KEY = Symbol('oganesson-tooltip-provider');

/** Buttons.md, Icon Variant: tooltips show after 500ms of hover… */
export const TOOLTIP_DELAY = 500;
/** …and immediately when moving to another tooltip within 200ms. */
export const TOOLTIP_SKIP_DELAY = 200;

export function markTooltipProvider(): void {
	setContext(KEY, true);
}

export function hasTooltipProvider(): boolean {
	return getContext<boolean | undefined>(KEY) === true;
}
