<!--
@component
Keyboard focus ring for a squircled control: a 2px ring 2px outside the
control, following its smooth corners. CSS outlines can't be used because the
control is clipped to its squircle.

Place it inside a `position: relative` element that is exactly the size of the
control and pass that size in. It's hidden by default; show it from CSS with
`opacity: 1` when the control has `:focus-visible`.
-->
<script lang="ts" module>
	/** Gap between the control and the ring, and the ring's width (Shapes.md / Buttons.md). */
	export const FOCUS_RING_GAP = 2;
	export const FOCUS_RING_WIDTH = 2;
</script>

<script lang="ts">
	import { generatePath } from '@lisse/core';
	import { cornerSmoothing, minSquircleRadius } from '../tokens.js';

	interface Props {
		width: number;
		height: number;
		/** The control's corner radius. */
		radius: number;
	}

	let { width, height, radius }: Props = $props();

	// The stroke is centred on the path, so put the path in the middle of the ring.
	const inset = FOCUS_RING_GAP + FOCUS_RING_WIDTH / 2;
	const w = $derived(width + inset * 2);
	const h = $derived(height + inset * 2);
	const d = $derived(
		width > 0 && height > 0
			? generatePath(w, h, {
					radius: radius + inset,
					smoothing: radius >= minSquircleRadius ? cornerSmoothing : 0
				})
			: ''
	);
</script>

{#if d}
	<svg
		class="og-focus-ring"
		aria-hidden="true"
		width={w}
		height={h}
		viewBox="0 0 {w} {h}"
		style:left="{-inset}px"
		style:top="{-inset}px"
	>
		<path {d} stroke-width={FOCUS_RING_WIDTH} />
	</svg>
{/if}

<style>
	.og-focus-ring {
		position: absolute;
		z-index: 2;
		overflow: visible;
		pointer-events: none;
		opacity: 0;
	}

	path {
		fill: none;
		stroke: var(--og-focus-ring-color);
	}
</style>
