import ChevronDown from '@lucide/svelte/icons/chevron-down';
import ChevronRight from '@lucide/svelte/icons/chevron-right';
import Check from '@lucide/svelte/icons/check';
import X from '@lucide/svelte/icons/x';
import { getContext, setContext, type Component } from 'svelte';

/**
 * Icons Oganesson draws itself (select chevrons, close buttons, …).
 * Lucide by default; replace any of them with `setOganessonIcons`.
 */
export interface OganessonIcons {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	chevronDown: Component<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	chevronRight: Component<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	check: Component<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	close: Component<any>;
}

export const defaultIcons: OganessonIcons = {
	chevronDown: ChevronDown,
	chevronRight: ChevronRight,
	check: Check,
	close: X
};

const KEY = Symbol('oganesson-icons');

/**
 * Swap the icons Oganesson uses internally, for every component below the
 * calling component (usually your root `+layout.svelte`). Unset icons keep
 * their current value.
 *
 * ```ts
 * import { X, CaretDown } from 'phosphor-svelte';
 * setOganessonIcons({ close: X, chevronDown: CaretDown });
 * ```
 */
export function setOganessonIcons(icons: Partial<OganessonIcons>): OganessonIcons {
	const merged = { ...getOganessonIcons(), ...icons };
	return setContext(KEY, merged);
}

/** The icons in effect for the calling component. */
export function getOganessonIcons(): OganessonIcons {
	return getContext<OganessonIcons | undefined>(KEY) ?? defaultIcons;
}
