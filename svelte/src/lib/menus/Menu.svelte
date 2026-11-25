<!--
@component
A menu of secondary or overflowing actions (design/Menus.md), opened from any
trigger, typically a button. Its items are `<MenuItem>`s: row buttons, each
with a unique icon and label. Keep it to 6 items or fewer; in development the
menu warns in the console above that.

The menu is 200px wide, in the elevated Acrylic container, 2px from its trigger.
It opens below the trigger and right-aligned by default; set `side` and `align`
to put it on any side. It moves automatically to stay entirely in view.

Render the trigger through the `trigger` snippet and spread `props` onto it.
`open` says whether the menu is showing, so the trigger can look active:

```svelte
<Menu>
	{#snippet trigger({ props, open })}
		<IconButton {...props} active={open} icon={Ellipsis} label="More" tooltip={false} />
	{/snippet}
	<MenuItem icon={Pencil} label="Rename" onSelect={rename} />
	<MenuItem icon={Trash2} label="Delete" colorway="danger" onSelect={remove} />
</Menu>
```
-->
<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { DEV } from 'esm-env';
	import type { EffectsConfig } from '@lisse/svelte';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { squircle } from '../internal/squircle.svelte.js';
	import { MAX_MENU_ITEMS, type MenuAlign, type MenuSide } from './menu.js';

	interface Props {
		/** The control that opens the menu. Spread `props` onto it. */
		trigger: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
		/** The menu's `<MenuItem>`s. */
		children: Snippet;
		/** Whether the menu is open. */
		open?: boolean;
		/** Which side of the trigger the menu opens on. It moves when there isn't room. */
		side?: MenuSide;
		/** How the menu lines up along that side. `end` is the right edge below or above. */
		align?: MenuAlign;
		/** The menu's width in pixels. */
		width?: number;
		/** Names the menu for assistive technology. By default the trigger names it. */
		'aria-label'?: string;
		class?: ClassValue;
		onOpenChange?: (open: boolean) => void;
	}

	let {
		trigger,
		children,
		open = $bindable(false),
		side = 'bottom',
		align = 'end',
		width = 200,
		'aria-label': ariaLabel,
		class: className,
		onOpenChange
	}: Props = $props();

	const uid = $props.id();
	const triggerId = `og-menu-trigger-${uid}`;

	let content = $state<HTMLElement | null>(null);

	// Menus.md: no more than 6 controls. A console warning in development only.
	$effect(() => {
		if (!DEV || !content) return;
		const count = content.querySelectorAll('[role^="menuitem"]').length;
		if (count > MAX_MENU_ITEMS) {
			console.warn(
				`[oganesson] This menu has ${count} items. Menus should contain no more than ${MAX_MENU_ITEMS} controls (Menus.md).`
			);
		}
	});

	// Acrylic (Elevated): the highlight is an inner shadow drawn along the squircle.
	// The drop shadow stays a CSS box-shadow on the rounded menu behind it (Shapes.md).
	const menuEffects: EffectsConfig = {
		innerShadow: { offsetX: 0, offsetY: 1, blur: 6, spread: 0, color: '#ffffff', opacity: 1 }
	};
</script>

<DropdownMenu.Root bind:open {onOpenChange}>
	<DropdownMenu.Trigger id={triggerId}>
		{#snippet child({ props })}
			{@render trigger({ props, open })}
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			bind:ref={content}
			class={['og-menu', className]}
			{side}
			{align}
			sideOffset={2}
			collisionPadding={8}
			loop
			aria-label={ariaLabel}
			aria-labelledby={ariaLabel ? undefined : triggerId}
			style="--og-menu-width: {width}px"
		>
			<div class="og-menu-surface" {@attach squircle({ radius: 12, effects: menuEffects })}>
				{@render children()}
			</div>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>

<style>
	/* The menu is portalled, hence :global. It holds the drop shadow on a plain
	   rounded rectangle; its child is the squircle-clipped acrylic surface
	   (Shapes.md). */
	:global(.og-menu) {
		z-index: 1000;
		box-sizing: border-box;
		width: var(--og-menu-width);
		max-width: var(--bits-floating-available-width);
		border-radius: 12px;
		box-shadow: var(--og-shadow-elevated);
		outline: none;
		/* Grows out of the point where it meets its trigger: the corner on the
		   aligned edge, or the middle of the facing edge when centred. */
		transform-origin: var(--bits-floating-transform-origin);
		transition:
			scale var(--og-duration-menu-in) var(--og-ease-movement),
			box-shadow var(--og-duration-menu-in) var(--og-ease-movement);
	}

	/*
	 * Menu motion (Animations.md): grows from 90% and sharpens from a 4px blur
	 * while fading in on open; the reverse on close.
	 *
	 * The fade and blur run on the surface, not on this element: an ancestor with
	 * opacity below 1 or a filter isolates the surface's backdrop-filter, so WebKit
	 * showed no acrylic blur until the entrance finished. Only the scale (transforms
	 * don't isolate backdrops) and the shadow animate here.
	 */
	:global(.og-menu[data-starting-style]),
	:global(.og-menu[data-ending-style]) {
		scale: 0.9;
		box-shadow: none;
	}

	:global(.og-menu[data-starting-style] > .og-menu-surface),
	:global(.og-menu[data-ending-style] > .og-menu-surface) {
		opacity: 0;
		filter: blur(4px);
	}

	/* Bits UI applies this while closing, so its transition runs on exit. */
	:global(.og-menu[data-ending-style]),
	:global(.og-menu[data-ending-style] > .og-menu-surface) {
		transition-duration: var(--og-duration-menu-out);
		transition-timing-function: var(--og-ease-out);
	}

	/* Menus.sketchframe: Menu Container. 4px padding around items 2px apart. */
	:global(.og-menu-surface) {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 4px;
		background: var(--og-bg-acrylic);
		-webkit-backdrop-filter: blur(var(--og-blur-menu));
		backdrop-filter: blur(var(--og-blur-menu));
		border-radius: 12px;
		transition:
			opacity var(--og-duration-menu-in) var(--og-ease-movement),
			filter var(--og-duration-menu-in) var(--og-ease-movement);
	}
</style>
