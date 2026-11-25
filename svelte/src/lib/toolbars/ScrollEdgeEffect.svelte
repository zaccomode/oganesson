<!--
@component
Elevates a toolbar or action bar over scrolling content (design/Core/Scroll Edge
Effect.md): a progressive blur that strengthens towards the edge, under a
gradient that fades into Background 1. Content scrolling underneath softens
smoothly instead of running into the toolbar.

It's a full-width bar pinned (`position: sticky`) to the `top` or `bottom` of
its scroll container, laying its children out in a row, 8px apart and 16px in
from each side, centred unless a child fills the row. Make it a direct child of
the scrolling element: first for the top edge, last for the bottom. Set
`pinned={false}` to position it yourself.

Use it only where there's a toolbar on top of it. Ordinary scroll overflow
without a toolbar should overflow cleanly, with no effect.

```svelte
<div class="page" style="overflow: auto">
	<ScrollEdgeEffect edge="top">
		<Toolbar aria-label="Navigation">…</Toolbar>
		<Text variant="title" style="flex: 1">Inbox</Text>
		<Toolbar aria-label="Actions">…</Toolbar>
	</ScrollEdgeEffect>
	…content…
	<ScrollEdgeEffect edge="bottom">
		<Toolbar aria-label="Compose">…</Toolbar>
	</ScrollEdgeEffect>
</div>
```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue, HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> {
		/** The toolbars (and any title) sitting on the effect. */
		children: Snippet;
		/** Which edge of the scroll container it's on. The blur is strongest at that edge. */
		edge?: 'top' | 'bottom';
		/** Stick to that edge while the content scrolls. */
		pinned?: boolean;
		class?: ClassValue;
		ref?: HTMLElement | null;
	}

	let {
		children,
		edge = 'top',
		pinned = true,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	/** Progressive blur bands, weakest (nearest the content) to strongest (at the edge). */
	const BLUR_STEPS = [0.5, 1, 2, 4];
</script>

<div
	bind:this={ref}
	{...rest}
	class={['og-scroll-edge', className]}
	data-edge={edge}
	data-pinned={pinned ? '' : undefined}
>
	<!--
		The effect is a sibling of the content, never its ancestor: masks and
		backdrop filters make an element a backdrop root, which would stop the
		toolbar groups' own acrylic blur from seeing the page behind them.
	-->
	<div class="og-scroll-edge-backdrop" aria-hidden="true">
		{#each BLUR_STEPS as blur, i (blur)}
			<span class="og-scroll-edge-blur" style="--og-blur: {blur}px; --og-band: {i}"></span>
		{/each}
	</div>
	<div class="og-scroll-edge-content">
		{@render children()}
	</div>
</div>

<style>
	.og-scroll-edge {
		position: relative;
		z-index: 10;
		box-sizing: border-box;
		/* Lets a pointer pass through the faded parts to the content underneath;
		   the controls on it turn pointer events back on. */
		pointer-events: none;
	}

	.og-scroll-edge[data-pinned] {
		position: sticky;
	}

	.og-scroll-edge[data-pinned][data-edge='top'] {
		top: 0;
	}

	.og-scroll-edge[data-pinned][data-edge='bottom'] {
		bottom: 0;
	}

	/* Scroll Edge Effect.sketchframe: Smooth Edge Effect. A row, 16px padding,
	   8px gaps, centred. */
	.og-scroll-edge-content {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 16px;
	}

	.og-scroll-edge-content > :global(*) {
		pointer-events: auto;
	}

	.og-scroll-edge-backdrop {
		position: absolute;
		inset: 0;
	}

	/*
	 * Progressive background blur: 4px at the edge, none at the content side.
	 * CSS can't vary a blur's radius across an element, so the blur is stacked
	 * in bands that double in strength towards the edge, each masked in and out
	 * so neighbouring bands cross-fade. The fades are masks on the blurred
	 * elements themselves; an ancestor with opacity, a filter or a mask would
	 * keep WebKit from blurring the page behind.
	 *
	 * --og-edge-toward points from the content towards the edge.
	 */
	.og-scroll-edge[data-edge='top'] {
		--og-edge-toward: to top;
	}

	.og-scroll-edge[data-edge='bottom'] {
		--og-edge-toward: to bottom;
	}

	.og-scroll-edge-blur {
		position: absolute;
		inset: 0;
		-webkit-backdrop-filter: blur(var(--og-blur));
		backdrop-filter: blur(var(--og-blur));
		/* Band n fades in over the quarter starting at n/4 of the way to the edge,
		   holds, and fades out over the quarter after (the last band never does). */
		--og-band-start: calc(var(--og-band) * 25%);
		--og-mask: linear-gradient(
			var(--og-edge-toward),
			transparent var(--og-band-start),
			black calc(var(--og-band-start) + 25%),
			black calc(var(--og-band-start) + 50%),
			transparent calc(var(--og-band-start) + 75%)
		);
		-webkit-mask-image: var(--og-mask);
		mask-image: var(--og-mask);
	}

	.og-scroll-edge-blur:last-child {
		--og-mask: linear-gradient(var(--og-edge-toward), transparent 75%, black 100%);
	}

	/* The gradient (one-off values from the Sketch file): Background 1 at 70% at the
	   edge, fading to transparent by the content side. */
	.og-scroll-edge-backdrop::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.og-scroll-edge[data-edge='top'] .og-scroll-edge-backdrop::after {
		background: linear-gradient(
			to top,
			rgba(245, 247, 247, 0) 2.38%,
			rgba(242, 244, 244, 0.702) 100%
		);
	}

	.og-scroll-edge[data-edge='bottom'] .og-scroll-edge-backdrop::after {
		background: linear-gradient(
			to bottom,
			rgba(245, 247, 247, 0) 0%,
			rgba(242, 244, 244, 0.702) 97.62%
		);
	}
</style>
