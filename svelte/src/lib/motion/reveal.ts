import type { TransitionConfig } from 'svelte/transition';
import { parseEasing } from './bezier.js';

/** Hidden, the content is scaled to this and blurred by this many pixels. */
const HIDDEN_SCALE = 0.95;
const HIDDEN_BLUR = 4;

/**
 * Reveal motion (design/Core/Animations.md: Reveal Motion): for content that
 * appears or disappears within its parent, such as a conditional form field.
 * Use it as both `in:reveal` and `out:reveal`, so each direction takes its own
 * timing:
 *
 * ```svelte
 * {#if useNickname}
 * 	<div in:reveal out:reveal>…</div>
 * {/if}
 * ```
 *
 * The content fades, sharpens from a 4px blur and grows from 95% scale (from its
 * top edge) while its height, vertical padding, borders and margins open up, so
 * the content after it slides instead of jumping. In a flex or grid parent it
 * also takes up its share of the parent's row gap. The reverse on the way out.
 *
 * Timing comes from the `--og-duration-reveal-*` and `--og-ease-reveal-*`
 * tokens as computed on the element, so reduced motion (0ms) and any override
 * apply. Prefer `<Reveal when={…}>`, which wraps this for you.
 */
export function reveal(
	node: Element,
	_params?: object,
	options?: { direction?: 'in' | 'out' | 'both' }
): TransitionConfig {
	const phase = options?.direction === 'out' ? 'out' : 'in';
	const style = getComputedStyle(node);

	// Reversed partway (the switch flipped back), the other direction's animation
	// is still applied, so the computed size is mid-way. Use the size measured
	// when the element was last at rest instead.
	const box = (node.getAnimations().length && measured.get(node)) || measure(style);
	measured.set(node, box);
	const { opacity, height, paddingTop, paddingBottom, borderTop, borderBottom } = box;
	const { marginTop, marginBottom } = box;

	// A flex or grid parent puts a gap between this and its neighbour even at
	// zero height; pull it in too. ('normal' in other layouts reads as 0.)
	const gap = node.parentElement ? px(getComputedStyle(node.parentElement).rowGap) : 0;
	const gapBefore = node.previousElementSibling ? gap : 0;
	const gapAfter = !gapBefore && node.nextElementSibling ? gap : 0;

	return {
		duration: readDuration(style.getPropertyValue(`--og-duration-reveal-${phase}`)),
		easing: parseEasing(style.getPropertyValue(`--og-ease-reveal-${phase}`)),
		css: (t, u) =>
			'overflow: clip;' +
			'transform-origin: top center;' +
			`opacity: ${t * opacity};` +
			`filter: blur(${u * HIDDEN_BLUR}px);` +
			`scale: ${HIDDEN_SCALE + (1 - HIDDEN_SCALE) * t};` +
			'min-height: 0;' +
			`height: ${t * height}px;` +
			`padding-top: ${t * paddingTop}px;` +
			`padding-bottom: ${t * paddingBottom}px;` +
			`border-top-width: ${t * borderTop}px;` +
			`border-bottom-width: ${t * borderBottom}px;` +
			`margin-top: ${t * marginTop - u * gapBefore}px;` +
			`margin-bottom: ${t * marginBottom - u * gapAfter}px;`
	};
}

/** An element's size and spacing at rest, as the reveal motion animates them. */
interface Box {
	opacity: number;
	height: number;
	paddingTop: number;
	paddingBottom: number;
	borderTop: number;
	borderBottom: number;
	marginTop: number;
	marginBottom: number;
}

const measured = new WeakMap<Element, Box>();

const px = (value: string) => parseFloat(value) || 0;

function measure(style: CSSStyleDeclaration): Box {
	return {
		opacity: +style.opacity,
		height: px(style.height),
		paddingTop: px(style.paddingTop),
		paddingBottom: px(style.paddingBottom),
		borderTop: px(style.borderTopWidth),
		borderBottom: px(style.borderBottomWidth),
		marginTop: px(style.marginTop),
		marginBottom: px(style.marginBottom)
	};
}

/** A CSS time (`200ms`, `0.2s`) in milliseconds; 0 if it can't be read. */
export function readDuration(value: string): number {
	const time = value.trim();
	const n = parseFloat(time);
	if (!Number.isFinite(n)) return 0;
	return time.endsWith('ms') ? n : time.endsWith('s') ? n * 1000 : 0;
}
