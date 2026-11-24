import { smoothCorners, type EffectsConfig, type SmoothCornersAction } from '@lisse/svelte';
import type { Attachment } from 'svelte/attachments';
import { cornerSmoothing, minSquircleRadius } from '../tokens.js';

export interface SquircleOptions {
	/**
	 * Corner radius in px. Defaults to the element's computed CSS
	 * `border-radius` when it mounts, so CSS stays the source of truth.
	 */
	radius?: number;
	/** 0 (plain arc) to 1. Defaults to the spec's 0.6. */
	smoothing?: number;
	/**
	 * Borders and shadows drawn by Lisse's SVG overlay. `clip-path` cuts off
	 * CSS `border`, `box-shadow` and `outline`, so squircled elements must
	 * draw them here instead.
	 */
	effects?: EffectsConfig;
}

/**
 * Resolves the radius to use, or `null` when the element should keep a plain
 * CSS border-radius (Shapes.md: squircles only from 8px).
 */
export function resolveRadius(explicit: number | undefined, computed: string): number | null {
	const radius = explicit ?? parseFloat(computed);
	if (!Number.isFinite(radius) || radius < minSquircleRadius) return null;
	return radius;
}

/**
 * Smooth ("squircle") corners per design/Core/Shapes.md, using Lisse.
 *
 * ```svelte
 * <div class="card" {@attach squircle()}>…</div>
 * <button {@attach squircle(() => ({ effects: { shadow } }))}>…</button>
 * ```
 *
 * The element keeps its CSS `border-radius` while server-rendered and before
 * hydration, then switches to a smooth-cornered `clip-path` in the browser.
 * Options are read reactively: pass a getter to update effects in place.
 */
export function squircle(
	options: SquircleOptions | (() => SquircleOptions) = {}
): Attachment<HTMLElement> {
	const get = typeof options === 'function' ? options : () => options;

	return (node) => {
		// Read before Lisse (or we) touch the element's styles.
		const computedRadius = getComputedStyle(node).borderTopLeftRadius;
		const inlineRadius = node.style.borderRadius;
		let handle: SmoothCornersAction | null = null;

		$effect(() => {
			const { radius: explicit, smoothing = cornerSmoothing, effects } = get();
			const radius = resolveRadius(explicit, computedRadius);

			if (radius === null) {
				handle?.destroy();
				handle = null;
				node.style.borderRadius = inlineRadius;
				return;
			}

			const config = {
				corners: { radius, smoothing },
				effects,
				// We pass borders/shadows explicitly so they can change with state;
				// Lisse's one-off extraction of CSS borders would go stale.
				autoEffects: false
			};
			// The squircle clip-path replaces the rounded rect; a CSS radius would
			// shave the smooth corners slightly.
			node.style.borderRadius = '0';
			if (handle) handle.update(config);
			else handle = smoothCorners(node, config);
		});

		return () => {
			handle?.destroy();
			node.style.borderRadius = inlineRadius;
		};
	};
}
