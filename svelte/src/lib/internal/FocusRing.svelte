<!--
@component
The focus indicator for a squircled control (design/Core/Focus.md): a 1px Dark
Thick Glass border just outside the control's edge and a 0.5px Dark Secondary
line just inside it, both following its smooth corners. It's drawn here, as a
sibling of the control, because the control is clipped to its squircle and
CSS borders and outlines would be cut off.

Place it inside a `position: relative` element exactly the size of the control
and pass that size in. It's hidden by default; show it from CSS with
`opacity: 1` (e.g. on `:focus-visible` or `:focus-within`).
-->
<script lang="ts">
	import { generatePath } from '@lisse/core';
	import { cornerSmoothing, minSquircleRadius } from '../tokens.js';

	interface Props {
		width: number;
		height: number;
		/** The control's corner radius. */
		radius: number;
		/** Draw the 0.5px inner line as well as the outer border. Default true. */
		inner?: boolean;
	}

	let { width, height, radius, inner = true }: Props = $props();

	const OUTER = 1;
	const INNER = 0.5;

	/** A smooth-cornered path offset from the control's edge (positive = outwards). */
	function offsetPath(offset: number): string {
		return generatePath(width + offset * 2, height + offset * 2, {
			radius: Math.max(0, radius + offset),
			smoothing: radius >= minSquircleRadius ? cornerSmoothing : 0
		});
	}

	// Strokes are centred on their paths, so offset each path by half its width.
	const outer = $derived(width > 0 && height > 0 ? offsetPath(OUTER / 2) : '');
	const innerLine = $derived(width > 0 && height > 0 && inner ? offsetPath(-INNER / 2) : '');
</script>

{#if outer}
	<svg class="og-focus-ring" aria-hidden="true" {width} {height} viewBox="0 0 {width} {height}">
		<path
			class="og-focus-ring-outer"
			d={outer}
			stroke-width={OUTER}
			transform="translate({-OUTER / 2} {-OUTER / 2})"
		/>
		{#if innerLine}
			<path
				class="og-focus-ring-inner"
				d={innerLine}
				stroke-width={INNER}
				transform="translate({INNER / 2} {INNER / 2})"
			/>
		{/if}
	</svg>
{/if}

<style>
	.og-focus-ring {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		overflow: visible;
		pointer-events: none;
		opacity: 0;
	}

	path {
		fill: none;
	}

	.og-focus-ring-outer {
		stroke: var(--og-focus-outer-color);
	}

	.og-focus-ring-inner {
		stroke: var(--og-focus-inner-color);
	}
</style>
