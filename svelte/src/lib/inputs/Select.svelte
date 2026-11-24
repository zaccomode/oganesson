<!--
@component
A select input (design/Inputs/Inputs.md: Select Inputs): pick one value from a
fixed list of options. It shares the text input's styles, left icon and
placeholder. With `typeahead`, the user can type into the field to filter the
options.

The menu opens below the field (or above, with `side="top"`) and flips when
there isn't room for `minHeight` (140px). It shows up to `maxItems` (5) options,
or `maxHeight` pixels, and never runs past the viewport; longer lists scroll.

```svelte
<Select bind:value={fruit} items={fruits} placeholder="Choose a fruit..." aria-label="Fruit" />
<Select typeahead icon={Search} items={countries} placeholder="Search countries..." aria-label="Country" />
```
-->
<script lang="ts">
	import { Combobox, Select as SelectPrimitive } from 'bits-ui';
	import { generatePath } from '@lisse/core';
	import type { EffectsConfig } from '@lisse/svelte';
	import type { ClassValue } from 'svelte/elements';
	import Icon from '../icons/Icon.svelte';
	import { getOganessonIcons } from '../icons/context.js';
	import FocusRing from '../internal/FocusRing.svelte';
	import { squircle } from '../internal/squircle.svelte.js';
	import { cornerSmoothing } from '../tokens.js';
	import type { IconComponent } from '../buttons/types.js';
	import { menuHeightForItems, type SelectOption } from './select.js';

	interface Props {
		/** The field's id, for a `<label for>`. */
		id?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		'aria-describedby'?: string;
		class?: ClassValue;
		/** The options to choose from. */
		items: SelectOption[];
		/** The selected option's value, or `''` for none. */
		value?: string;
		/** Whether the menu is open. */
		open?: boolean;
		/** Shown while nothing is selected: a short description ending in an ellipsis. */
		placeholder?: string;
		/** Default (thin glass background) or subtle (no background). */
		appearance?: 'default' | 'subtle';
		icon?: IconComponent;
		/** Let the user type into the field to filter the options. */
		typeahead?: boolean;
		/** Shown in the menu when typeahead filtering leaves no options. */
		emptyText?: string;
		/** Add an option at the top of the menu that clears the selection back to empty. */
		allowEmpty?: boolean;
		/** The label of the empty option. */
		emptyOptionLabel?: string;
		/** Where the menu opens. It flips to the other side when there isn't room. */
		side?: 'bottom' | 'top';
		/** The least height the menu needs before it flips to the other side. */
		minHeight?: number;
		/** How many options the menu shows before it scrolls. */
		maxItems?: number;
		/** The menu's maximum height in pixels. Overrides `maxItems`. */
		maxHeight?: number;
		disabled?: boolean;
		required?: boolean;
		/** Submits the value with a form under this name. */
		name?: string;
		onValueChange?: (value: string) => void;
		onOpenChange?: (open: boolean) => void;
	}

	let {
		items,
		value = $bindable(''),
		open = $bindable(false),
		placeholder,
		appearance = 'default',
		icon,
		typeahead = false,
		emptyText = 'No results',
		allowEmpty = false,
		emptyOptionLabel = 'None',
		side = 'bottom',
		minHeight = 140,
		maxItems = 5,
		maxHeight,
		disabled = false,
		required,
		name,
		onValueChange,
		onOpenChange,
		class: className,
		...labelling
	}: Props = $props();

	const icons = getOganessonIcons();

	// ── Field ──────────────────────────────────────────────────────────────

	let width = $state(0);
	let height = $state(0);
	let input = $state<HTMLInputElement | null>(null);

	const selected = $derived(items.find((item) => item.value === value));

	/** Clicking anywhere in a typeahead field focuses its input and opens the menu. */
	function focusInput(event: PointerEvent) {
		if (disabled || event.button !== 0) return;
		if (event.target !== input) event.preventDefault();
		input?.focus();
		open = true;
	}

	// ── Typeahead ──────────────────────────────────────────────────────────

	/** The typeahead field's element: the menu lines up with it, not the bare input. */
	let fieldElement = $state<HTMLElement | null>(null);
	/** What the user has typed to filter by. */
	let query = $state('');
	/**
	 * The text in the typeahead input: the selected label, or what's being typed.
	 * Choosing an option (or setting `value`) puts its label back.
	 */
	let inputText = $derived(selected?.label ?? '');

	const visible = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!typeahead || !needle) return items;
		return items.filter((item) => item.label.toLowerCase().includes(needle));
	});

	/** The empty option, which sets the value back to `''`. */
	const emptyOption = $derived<SelectOption>({ value: '', label: emptyOptionLabel });

	/** What Bits UI knows about, for labels and keyboard typeahead. */
	const allItems = $derived(allowEmpty ? [emptyOption, ...items] : items);

	/** What the menu shows. The empty option is hidden while filtering, since it matches nothing. */
	const options = $derived(allowEmpty && !query.trim() ? [emptyOption, ...visible] : visible);

	function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
		inputText = query = event.currentTarget.value;
	}

	function handleOpenChange(next: boolean) {
		// Closing drops the filter, and any typing that didn't choose an option,
		// so the field shows the selection again and reopens with every option.
		if (!next) {
			query = '';
			inputText = selected?.label ?? '';
		}
		onOpenChange?.(next);
	}

	// ── Menu ───────────────────────────────────────────────────────────────

	let viewport = $state<HTMLElement | null>(null);
	let list = $state<HTMLElement | null>(null);
	let listWidth = $state(0);
	let metrics = $state({ top: 0, scrollHeight: 0, clientHeight: 0 });

	$effect(() => {
		const scroller = viewport;
		const content = list;
		if (!scroller || !content) return;
		const update = () => {
			metrics = {
				top: scroller.scrollTop,
				scrollHeight: scroller.scrollHeight,
				clientHeight: scroller.clientHeight
			};
		};
		update();
		scroller.addEventListener('scroll', update, { passive: true });
		const observer = new ResizeObserver(update);
		observer.observe(scroller);
		observer.observe(content);
		return () => {
			scroller.removeEventListener('scroll', update);
			observer.disconnect();
		};
	});

	const scrollable = $derived(metrics.scrollHeight > metrics.clientHeight + 1);
	const overflowTop = $derived(scrollable && metrics.top > 1);
	const overflowBottom = $derived(
		scrollable && metrics.top + metrics.clientHeight < metrics.scrollHeight - 1
	);

	/** The scrollbar thumb: a 2px line inset 12px from the menu's top and bottom. */
	const TRACK_INSET = 12;
	const MIN_THUMB = 20;
	const thumb = $derived.by(() => {
		if (!scrollable) return null;
		const track = metrics.clientHeight - TRACK_INSET * 2;
		const length = Math.max(MIN_THUMB, (track * metrics.clientHeight) / metrics.scrollHeight);
		const progress = metrics.top / (metrics.scrollHeight - metrics.clientHeight);
		return {
			top: TRACK_INSET + (track - length) * Math.min(1, Math.max(0, progress)),
			length
		};
	});

	// Every item is the same size, so they share one smooth-cornered clip path
	// instead of each running its own squircle.
	const ITEM_HEIGHT = 30;
	const itemWidth = $derived(listWidth - 4 - (scrollable ? 8 : 4));
	const itemClip = $derived(
		itemWidth > 0
			? `path('${generatePath(itemWidth, ITEM_HEIGHT, { radius: 8, smoothing: cornerSmoothing })}')`
			: 'none'
	);

	const menuMaxHeight = $derived(maxHeight ?? menuHeightForItems(maxItems));

	// Acrylic (Elevated): the highlight is an inner shadow drawn along the squircle.
	// The drop shadow stays a CSS box-shadow on the rounded menu behind it (Shapes.md).
	const menuEffects: EffectsConfig = {
		innerShadow: { offsetX: 0, offsetY: 1, blur: 6, spread: 0, color: '#ffffff', opacity: 1 }
	};
</script>

{#snippet field()}
	{#if typeahead}
		<!-- Pointer-only convenience: forwards clicks on the padding to the input, which
		     keyboard users reach directly. -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="og-select-field og-surface"
			data-icon={icon ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
			data-typeahead=""
			onpointerdown={focusInput}
			bind:this={fieldElement}
			{@attach squircle()}
		>
			{#if icon}<Icon {icon} class="og-select-icon" />{/if}
			<Combobox.Input
				bind:ref={input}
				class="og-select-input og-label"
				{placeholder}
				oninput={handleInput}
				{...labelling}
			>
				<!-- Render the input ourselves so its text can be reset on close. -->
				{#snippet child({ props })}
					<input {...props} value={inputText} />
				{/snippet}
			</Combobox.Input>
			<Combobox.Trigger class="og-select-chevron" tabindex={-1} aria-label="Show options">
				<Icon icon={icons.chevronsUpDown} />
			</Combobox.Trigger>
		</div>
	{:else}
		<SelectPrimitive.Trigger
			class="og-select-field og-surface"
			data-icon={icon ? '' : undefined}
			{...labelling}
			{@attach squircle()}
		>
			{#if icon}<Icon {icon} class="og-select-icon" />{/if}
			<span class="og-select-value og-label" data-placeholder={selected ? undefined : ''}>
				{selected?.label ?? placeholder ?? ''}
			</span>
			<span class="og-select-chevron"><Icon icon={icons.chevronsUpDown} /></span>
		</SelectPrimitive.Trigger>
	{/if}
{/snippet}

{#snippet menu()}
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			class="og-select-menu"
			{side}
			sideOffset={2}
			align="start"
			collisionPadding={8}
			customAnchor={typeahead ? fieldElement : null}
			style="--og-select-max-height: {menuMaxHeight}px; --og-select-min-height: {minHeight}px"
		>
			<div class="og-select-menu-surface" {@attach squircle({ radius: 12, effects: menuEffects })}>
				<SelectPrimitive.Viewport class="og-select-viewport" bind:ref={viewport}>
					<div
						class="og-select-list"
						data-scrollable={scrollable ? '' : undefined}
						style="--og-select-item-clip: {itemClip}"
						bind:this={list}
						bind:clientWidth={listWidth}
					>
						{#each options as item (item.value)}
							<SelectPrimitive.Item
								class="og-select-item og-label"
								value={item.value}
								label={item.label}
								disabled={item.disabled}
								data-empty={item.value === '' ? '' : undefined}
							>
								{#snippet children({ selected: isSelected })}
									<span class="og-select-check">
										{#if isSelected}<Icon icon={icons.check} />{/if}
									</span>
									<span class="og-select-item-label">{item.label}</span>
								{/snippet}
							</SelectPrimitive.Item>
						{:else}
							<div class="og-select-empty og-label">{emptyText}</div>
						{/each}
					</div>
				</SelectPrimitive.Viewport>
				<div
					class="og-select-overflow"
					data-edge="top"
					data-shown={overflowTop ? '' : undefined}
				></div>
				<div
					class="og-select-overflow"
					data-edge="bottom"
					data-shown={overflowBottom ? '' : undefined}
				></div>
				{#if thumb}
					<div
						class="og-select-scrollbar"
						style="top: {thumb.top}px; height: {thumb.length}px"
						aria-hidden="true"
					></div>
				{/if}
			</div>
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
{/snippet}

<div
	class={['og-select', className]}
	data-appearance={appearance}
	data-disabled={disabled ? '' : undefined}
	data-state={open ? 'open' : 'closed'}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	{#if typeahead}
		<Combobox.Root
			type="single"
			bind:value
			bind:open
			items={allItems}
			{disabled}
			{required}
			{name}
			{onValueChange}
			onOpenChange={handleOpenChange}
		>
			{@render field()}
			{@render menu()}
		</Combobox.Root>
	{:else}
		<SelectPrimitive.Root
			type="single"
			bind:value
			bind:open
			items={allItems}
			{disabled}
			{required}
			{name}
			{onValueChange}
			onOpenChange={handleOpenChange}
		>
			{@render field()}
			{@render menu()}
		</SelectPrimitive.Root>
	{/if}
	<FocusRing {width} {height} radius={8} inner={appearance === 'default'} />
</div>

<style>
	/* ── Field (shares the text input's look; Inputs.md) ─────────────────── */

	.og-select {
		position: relative;
		display: flex;
		min-width: 0;
	}

	/* Like a button, the plain select shows focus for the keyboard only; with
	   typeahead it's a text field, so any focus shows it (Focus.md). */
	.og-select:has(:global(.og-select-field:focus-visible)) > :global(.og-focus-ring),
	.og-select:has(:global(.og-select-input:focus)) > :global(.og-focus-ring) {
		opacity: 1;
		transition-duration: 0s;
	}

	.og-select :global(.og-select-field) {
		appearance: none;
		box-sizing: border-box;
		display: flex;
		flex: 1;
		align-items: center;
		gap: 6px;
		min-width: 0;
		height: 30px;
		margin: 0;
		padding: 6px 8px 6px 10px;
		border: 0;
		font: inherit;
		color: var(--og-color-dark);
		text-align: left;
		cursor: pointer;
		outline: none;
		-webkit-tap-highlight-color: transparent;
		--og-icon-size: 12px;
		--og-surface-hover: var(--og-color-dark-thin-glass);
		--og-surface-press: var(--og-color-dark-thick-glass);
	}

	.og-select[data-appearance='default'] :global(.og-select-field) {
		--og-surface-bg: var(--og-color-dark-thin-glass);
	}

	.og-select :global(.og-select-field[data-icon]) {
		padding-left: 8px;
	}

	/* A typeahead field is a text field: no press layer, a text cursor (Inputs.md). */
	.og-select :global(.og-select-field[data-typeahead]) {
		cursor: text;
		--og-surface-press: transparent;
	}

	.og-select[data-disabled] :global(.og-select-field) {
		color: var(--og-color-dark-secondary);
		cursor: default;
	}

	.og-select :global(.og-select-icon) {
		color: var(--og-color-dark-secondary);
	}

	.og-select[data-state='open'] :global(.og-select-icon),
	.og-select:has(:global(.og-select-field:focus-visible)) :global(.og-select-icon),
	.og-select:has(:global(.og-select-input:focus)) :global(.og-select-icon) {
		color: var(--og-color-dark);
	}

	.og-select :global(.og-select-value) {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.og-select :global(.og-select-value[data-placeholder]) {
		color: var(--og-color-dark-secondary);
	}

	.og-select :global(.og-select-input) {
		flex: 1;
		min-width: 0;
		height: 18px;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font-family: var(--og-font-sans);
		outline: none;
		appearance: none;
	}

	.og-select :global(.og-select-input::placeholder) {
		color: var(--og-color-dark-secondary);
		opacity: 1;
	}

	.og-select :global(.og-select-input:disabled) {
		color: inherit;
		-webkit-text-fill-color: currentColor;
	}

	.og-select :global(.og-select-chevron) {
		display: flex;
		flex: none;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: var(--og-color-dark-secondary);
		cursor: inherit;
	}

	/* ── Menu (portalled, hence :global) ─────────────────────────────────── */

	/* The menu holds the drop shadow on a plain rounded rectangle; its child is
	   the squircle-clipped acrylic surface (Shapes.md). */
	:global(.og-select-menu) {
		z-index: 1000;
		min-width: var(--bits-floating-anchor-width);
		max-width: var(--bits-floating-available-width);
		/* Up to the item cap, and never past the viewport — but at least the minimum
		   height, so a menu with too little room overflows and flips instead. */
		max-height: min(
			var(--og-select-max-height),
			max(var(--bits-floating-available-height), var(--og-select-min-height))
		);
		border-radius: 12px;
		box-shadow: var(--og-shadow-elevated);
		/* Grows out of the edge facing the field, centred along it. The open state's
		   transition is the one that runs on entrance. */
		transform-origin: top center;
		transition:
			opacity var(--og-duration-menu-in) var(--og-ease-movement),
			scale var(--og-duration-menu-in) var(--og-ease-movement),
			filter var(--og-duration-menu-in) var(--og-ease-movement);
	}

	/* Above the field (opened or flipped there), it grows from its bottom edge. */
	:global(.og-select-menu[data-side='top']) {
		transform-origin: bottom center;
	}

	/* Grows from 90% and sharpens from a 4px blur while fading in on open; the
	   reverse on close. */
	:global(.og-select-menu[data-starting-style]),
	:global(.og-select-menu[data-ending-style]) {
		opacity: 0;
		scale: 0.9;
		filter: blur(4px);
	}

	/* Bits UI applies this while closing, so its transition runs on exit. The exit
	   uses the snappier interaction curve. */
	:global(.og-select-menu[data-ending-style]) {
		transition-duration: var(--og-duration-menu-out);
		transition-timing-function: var(--og-ease-out);
	}

	:global(.og-select-menu-surface) {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 0;
		flex: 1;
		background: var(--og-bg-acrylic);
		-webkit-backdrop-filter: blur(var(--og-blur-menu));
		backdrop-filter: blur(var(--og-blur-menu));
		border-radius: 12px;
		overflow: hidden;
	}

	/* The design draws its own scrollbar, so the native one is hidden. */
	:global(.og-select-viewport) {
		scrollbar-width: none;
	}

	:global(.og-select-viewport::-webkit-scrollbar) {
		display: none;
	}

	:global(.og-select-list) {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 4px;
	}

	/* Room for the scrollbar (Menu Exploration - Scrolling Items.sketchframe). */
	:global(.og-select-list[data-scrollable]) {
		padding-right: 8px;
	}

	/* ── Items (Inputs-Select Input Menu Item.sketchframe) ──────────────── */

	:global(.og-select-item) {
		position: relative;
		isolation: isolate;
		box-sizing: border-box;
		display: flex;
		flex: none;
		align-items: center;
		gap: 6px;
		height: 30px;
		padding: 6px 10px 6px 8px;
		color: var(--og-color-dark);
		white-space: nowrap;
		cursor: pointer;
		clip-path: var(--og-select-item-clip);
		outline: none;
		user-select: none;
		--og-icon-size: 12px;
	}

	/* Hover (or keyboard highlight) and press layers, with the interaction timing
	   (Animations.md). Bits UI marks the highlighted item for pointer and keys. */
	:global(.og-select-item::before),
	:global(.og-select-item::after) {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		opacity: 0;
	}

	:global(.og-select-item::before) {
		background-color: var(--og-color-dark-thin-glass);
		transition: opacity var(--og-duration-hover-out) var(--og-ease-out);
	}

	:global(.og-select-item::after) {
		background-color: var(--og-color-dark-thick-glass);
		transition: opacity var(--og-duration-press-out) var(--og-ease-out);
	}

	:global(.og-select-item[data-highlighted]::before),
	:global(.og-select-item:not([data-disabled]):active::after) {
		opacity: 1;
		transition-duration: 0s;
	}

	:global(.og-select-item > *) {
		position: relative;
		z-index: 1;
	}

	:global(.og-select-item[data-disabled]) {
		color: var(--og-color-dark-secondary);
		cursor: default;
	}

	/* The check sits in a fixed 12px slot, so labels line up whether or not their
	   option is selected. */
	:global(.og-select-check) {
		display: flex;
		flex: none;
		width: 12px;
		height: 12px;
	}

	:global(.og-select-item-label) {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* The empty option reads like the placeholder it brings back. */
	:global(.og-select-item[data-empty] .og-select-item-label) {
		color: var(--og-color-dark-secondary);
	}

	:global(.og-select-empty) {
		padding: 6px 10px 6px 26px;
		color: var(--og-color-dark-secondary);
	}

	/* ── Scrolling ───────────────────────────────────────────────────────── */

	/* Overflow indicators: fade the menu out towards an edge that has more options
	   beyond it, to encourage scrolling. */
	:global(.og-select-overflow) {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 1;
		height: 20px;
		pointer-events: none;
		opacity: 0;
		transition: opacity var(--og-duration-movement) var(--og-ease-movement);
	}

	:global(.og-select-overflow[data-edge='top']) {
		top: 0;
		/* One-off overlay colour from the scrolling exploration, not a palette colour. */
		background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.949) 100%);
	}

	:global(.og-select-overflow[data-edge='bottom']) {
		bottom: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.949) 100%);
	}

	:global(.og-select-overflow[data-shown]) {
		opacity: 1;
	}

	/* A 2px rounded line, 4px in from the right edge. Dark at 40% is a one-off value
	   from the scrolling exploration. */
	:global(.og-select-scrollbar) {
		position: absolute;
		right: 3px;
		z-index: 2;
		width: 2px;
		border-radius: 1px;
		background: rgba(33, 37, 43, 0.4);
		pointer-events: none;
	}
</style>
