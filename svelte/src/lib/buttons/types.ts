import type { Component } from 'svelte';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

/** Buttons.md: Button Styles. */
export type ButtonAppearance = 'subtle' | 'prominent';

/** Subtle button colourways (Buttons.md: Subtle Style). Prominent buttons ignore it. */
export type ButtonColorway = 'dark' | 'primary' | 'danger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponent = Component<any>;

/** Attributes shared by every button, passed through to the `<button>` or `<a>`. */
export type ButtonElementAttributes = Omit<
	HTMLButtonAttributes & HTMLAnchorAttributes,
	'children' | 'disabled' | 'href'
>;

export interface ButtonCommonProps extends ButtonElementAttributes {
	/** Subtle (default) or prominent. */
	appearance?: ButtonAppearance;
	/** Colourway for subtle buttons: dark (default), primary or danger. */
	colorway?: ButtonColorway;
	/** Shows the active state (e.g. the current navigation item). Subtle buttons only. */
	active?: boolean;
	/** Prominent buttons only: show the drop shadow at rest, not just on hover. */
	elevated?: boolean;
	disabled?: boolean;
	/** Renders a link (`<a>`) instead of a `<button>`. */
	href?: string;
	/** The rendered `<button>` or `<a>`. */
	ref?: HTMLElement | null;
}
