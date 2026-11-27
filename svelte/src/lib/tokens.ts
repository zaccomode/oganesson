/**
 * Oganesson design tokens for JavaScript.
 *
 * Mirrors src/lib/styles/tokens.css, which is the source of truth for styling;
 * tokens.spec.ts fails if the two drift apart. Prefer the CSS custom properties
 * (`var(--og-…)`) in styles; use these where you need values in script.
 */

export const colors = {
	dark: '#21252b',
	'dark-secondary': 'rgba(33, 37, 43, 0.6)',
	'dark-thick-glass': 'rgba(33, 37, 43, 0.141)',
	'dark-thin-glass': 'rgba(33, 37, 43, 0.059)',

	white: '#ffffff',
	'white-secondary': 'rgba(255, 255, 255, 0.6)',
	'white-thick-glass': 'rgba(255, 255, 255, 0.141)',
	'white-thin-glass': 'rgba(255, 255, 255, 0.059)',

	primary: '#5155ef',
	'primary-secondary': 'rgba(81, 85, 239, 0.6)',
	'primary-thick-glass': 'rgba(81, 85, 239, 0.2)',
	'primary-thin-glass': 'rgba(81, 85, 239, 0.102)',

	danger: '#ce1e0c',
	'danger-secondary': 'rgba(206, 30, 12, 0.6)',
	'danger-thick-glass': 'rgba(206, 30, 12, 0.141)',
	'danger-thin-glass': 'rgba(206, 30, 12, 0.078)'
} as const;

export type ColorToken = keyof typeof colors;

export const backgrounds = {
	'1': '#f2f4f4',
	acrylic: 'rgba(255, 255, 255, 0.702)'
} as const;

export const typography = {
	'large-title': { font: 'sans', size: 28, lineHeight: 34, weight: 600 },
	title: { font: 'sans', size: 18, lineHeight: 22, weight: 500 },
	'title-2': { font: 'sans', size: 16, lineHeight: 20, weight: 500 },
	label: { font: 'sans', size: 14, lineHeight: 18, weight: 400 },
	'small-label': { font: 'sans', size: 12, lineHeight: 15, weight: 400 },
	subtitle: { font: 'mono', size: 11, lineHeight: 14, weight: 400 },
	caption: { font: 'mono', size: 9, lineHeight: 12, weight: 400 }
} as const;

export type TextVariant = keyof typeof typography;

export const radius = 8;
/** Corner smoothing used throughout the Sketch files (Figma's 60% "iOS" preset). */
export const cornerSmoothing = 0.6;
/** Radii below this use plain CSS border-radius instead of squircles (Shapes.md). */
export const minSquircleRadius = 8;

export const iconSize = 16;

export const motion = {
	easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
	hoverOutMs: 500,
	pressOutMs: 1000,
	/** Movement such as a prominent button's raise: the same both ways. */
	movementMs: 150,
	easeMovement: 'ease-out',
	/** The focus indicator appears instantly and fades out over this. */
	focusOutMs: 500,
	/** Menus, select menus and modals: a decelerating entrance, a quicker ease-in-out exit. */
	menuInMs: 200,
	easeMenuIn: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
	menuOutMs: 150,
	easeMenuOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
	/** The dimmed background behind modals fades in quickly, and out more slowly. */
	backdropInMs: 200,
	backdropOutMs: 300
} as const;
