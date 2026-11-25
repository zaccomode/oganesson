<!--
@component
The acrylic container that holds a toolbar's controls (design/Toolbars.md).
Every `<Toolbar>` has at least one. Split its controls into sections with
`<ToolbarSeparator>`.

It hugs its controls; set `fill` to stretch it across the room left in the
toolbar, for example around a select input.

```svelte
<ToolbarGroup fill>
	<Select items={projects} bind:value={project} icon={Folder} aria-label="Project" />
</ToolbarGroup>
```
-->
<script lang="ts">
	import type { EffectsConfig } from '@lisse/svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { squircle } from '../internal/squircle.svelte.js';
	import { getToolbarContext, toolbarGroupMetrics } from './context.js';

	interface Props {
		/** The group's controls and separators. */
		children: Snippet;
		/** Stretch the group to fill the toolbar's remaining width. */
		fill?: boolean;
		/** Names the group for assistive technology. */
		'aria-label'?: string;
		class?: ClassValue;
	}

	let { children, fill = false, 'aria-label': ariaLabel, class: className }: Props = $props();

	const toolbar = getToolbarContext();
	const size = $derived(toolbar?.size ?? 'regular');
	const metrics = $derived(toolbarGroupMetrics[size]);

	// Acrylic (Elevated): the white highlight is an inner shadow drawn along the
	// squircle. The drop shadow is a CSS box-shadow on the rounded wrapper (Shapes.md).
	const groupEffects: EffectsConfig = {
		innerShadow: { offsetX: 0, offsetY: 1, blur: 6, spread: 0, color: '#ffffff', opacity: 1 }
	};
</script>

<div
	class={['og-toolbar-group', className]}
	role="group"
	aria-label={ariaLabel}
	data-size={size}
	data-fill={fill ? '' : undefined}
	style="--og-toolbar-radius: {metrics.radius}px; --og-toolbar-padding: {metrics.padding}px; --og-toolbar-gap: {metrics.gap}px"
>
	<div
		class="og-toolbar-group-surface"
		{@attach squircle(() => ({ radius: metrics.radius, effects: groupEffects }))}
	>
		{@render children()}
	</div>
</div>

<style>
	/* Holds the elevated drop shadow on a plain rounded rectangle; its child is the
	   squircle-clipped acrylic surface (Shapes.md). Nothing here may take an
	   opacity, filter or mask: any of those would stop WebKit blurring what's
	   behind the surface. */
	.og-toolbar-group {
		display: flex;
		flex: none;
		min-width: 0;
		border-radius: var(--og-toolbar-radius);
		box-shadow: var(--og-shadow-elevated);
	}

	.og-toolbar-group[data-fill] {
		flex: 1;
	}

	/* Toolbars.sketchframe: Toolbar Group. Regular: 10px corners, 2px padding and
	   gaps. Large: 12px corners, 4px padding and gaps. */
	.og-toolbar-group-surface {
		display: flex;
		flex: 1;
		align-items: center;
		gap: var(--og-toolbar-gap);
		min-width: 0;
		padding: var(--og-toolbar-padding);
		background: var(--og-bg-acrylic);
		-webkit-backdrop-filter: blur(var(--og-blur-menu));
		backdrop-filter: blur(var(--og-blur-menu));
		border-radius: var(--og-toolbar-radius);
	}

	/* Controls that fill (such as a select input) share the group's width. */
	.og-toolbar-group[data-fill] .og-toolbar-group-surface > :global(*) {
		flex: 1 1 auto;
		min-width: 0;
	}
</style>
