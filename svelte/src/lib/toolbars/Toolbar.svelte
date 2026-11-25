<!--
@component
A row of functionally similar controls elevated over the content behind them
(design/Toolbars.md). A toolbar holds one or more `<ToolbarGroup>`s, the acrylic
containers, 4px apart; split the controls inside a group into sections with
`<ToolbarSeparator>`.

Toolbars take Oganesson buttons, menus and inputs. Prefer the subtle style for
the controls inside. Buttons (including menu triggers) share one tab stop: Tab
moves into the toolbar and the arrow keys move between its buttons. Inputs
keep their own tab stops, because they use the arrow keys themselves.

Two sizes: `regular` (the default) for most navigation, and `large` to make the
controls more prominent. To pin a toolbar to the top or bottom of scrolling
content, put it in a `<ScrollEdgeEffect>`.

```svelte
<Toolbar aria-label="Formatting">
	<ToolbarGroup>
		<IconButton icon={Bold} label="Bold" />
		<IconButton icon={Italic} label="Italic" />
		<ToolbarSeparator />
		<IconButton icon={Link} label="Link" />
	</ToolbarGroup>
</Toolbar>
```
-->
<script lang="ts">
	import { Toolbar as ToolbarPrimitive, type ToolbarRootProps } from 'bits-ui';
	import { DEV } from 'esm-env';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { setToolbarContext, type ToolbarSize } from './context.js';

	interface Props extends Omit<
		ToolbarRootProps,
		'children' | 'child' | 'class' | 'orientation' | 'loop' | 'ref'
	> {
		/** The toolbar's `<ToolbarGroup>`s. */
		children: Snippet;
		/** Regular (default) or large, to emphasise the controls. */
		size?: ToolbarSize;
		/** Whether the arrow keys wrap around from the last button to the first. */
		loop?: boolean;
		/** Names the toolbar for assistive technology. */
		'aria-label'?: string;
		class?: ClassValue;
		/** The toolbar element. */
		ref?: HTMLElement | null;
	}

	let {
		children,
		size = 'regular',
		loop = true,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	setToolbarContext({
		get size() {
			return size;
		}
	});

	// Toolbars.md: a toolbar must contain at least one group. Development only.
	$effect(() => {
		if (!DEV || !ref) return;
		if (!ref.querySelector(':scope > .og-toolbar-group')) {
			console.warn(
				'[oganesson] This toolbar has no <ToolbarGroup>. Toolbars must contain at least one group (Toolbars.md).'
			);
		}
	});
</script>

<ToolbarPrimitive.Root
	bind:ref
	{...rest}
	{loop}
	orientation="horizontal"
	class={['og-toolbar', className]}
	data-size={size}
>
	{@render children()}
</ToolbarPrimitive.Root>

<style>
	/* Toolbars.sketchframe: groups sit 4px apart, top-aligned, at either size. */
	/* On Bits UI's element, hence :global. */
	:global(.og-toolbar) {
		display: flex;
		align-items: flex-start;
		gap: 4px;
		min-width: 0;
	}
</style>
