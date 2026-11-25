<!--
@component
One action in a `<Menu>` (design/Menus.md): a row button with a unique icon and
label. Danger actions use the danger colourway. Choosing an item runs
`onSelect` and closes the menu; with `href` it's a link.

The item under the pointer, or the one reached with the arrow keys, takes the
hover layer (Animations.md). Type to jump to an item by its label.

```svelte
<MenuItem icon={Copy} label="Duplicate" onSelect={duplicate} />
<MenuItem icon={Trash2} label="Delete" colorway="danger" onSelect={remove} />
```
-->
<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import RowButton from '../buttons/RowButton.svelte';
	import type { ButtonColorway, IconComponent } from '../buttons/types.js';
	import { setToolbarContext } from '../toolbars/context.js';

	interface Props {
		icon: IconComponent;
		label: string;
		/** Dark (default), primary or danger. */
		colorway?: ButtonColorway;
		/** Extra information at the right, such as a keyboard shortcut. */
		secondaryLabel?: string;
		secondaryIcon?: IconComponent;
		disabled?: boolean;
		/** Makes the item a link. */
		href?: string;
		/** Runs when the item is chosen, by pointer or keyboard. */
		onSelect?: (event: Event) => void;
		/** Keep the menu open after choosing this item. */
		closeOnSelect?: boolean;
	}

	let {
		icon,
		label,
		colorway = 'dark',
		secondaryLabel,
		secondaryIcon,
		disabled = false,
		href,
		onSelect,
		closeOnSelect = true
	}: Props = $props();

	// A menu opened from a toolbar is portalled out of it, so its items aren't the
	// toolbar's buttons: they keep the menu's own arrow-key navigation.
	setToolbarContext(null);
</script>

<DropdownMenu.Item {disabled} {onSelect} {closeOnSelect} textValue={label}>
	{#snippet child({ props })}
		<RowButton
			{...props}
			{icon}
			{colorway}
			{secondaryLabel}
			{secondaryIcon}
			{disabled}
			{href}
			class="og-menu-item"
		>
			{label}
		</RowButton>
	{/snippet}
</DropdownMenu.Item>

<style>
	/* Portalled with the menu, hence :global. */

	/* Only the highlighted item takes the hover layer, whether the pointer or the
	   arrow keys put it there (Animations.md: Menu items). Bits UI highlights the
	   item under the pointer, so the plain :hover layer is turned off to keep the
	   pointer and the keyboard from lighting two items at once. */
	:global(.og-menu-item.og-surface:not([data-highlighted]):hover::before) {
		opacity: 0;
	}

	:global(.og-menu-item.og-surface[data-highlighted]:not([data-disabled])::before) {
		opacity: 1;
		transition-duration: 0s;
	}

	/* The highlight is the menu's focus indicator, so the ring stays hidden. */
	:global(.og-button-frame:has(> .og-menu-item) > .og-focus-ring) {
		display: none;
	}
</style>
