<!--
@component
A single-line text input (design/Inputs/Inputs.md: Text Inputs).

The **default** style sits on thin glass; use **subtle** (no background) where
the input is already contained, such as in a toolbar. An optional icon on the
left explains the field when it stands alone (e.g. search). While focused, the
input shows the focus border (Focus.md).

Placeholders are a short description ending in an ellipsis: an example value
when the field has a visible label ("John Doe..."), an action when it doesn't
("Search items...").

```svelte
<TextInput bind:value={name} placeholder="John Doe..." aria-label="Name" />
<TextInput appearance="subtle" icon={Search} placeholder="Search items..." aria-label="Search" />
```
-->
<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Icon from '../icons/Icon.svelte';
	import FocusRing from '../internal/FocusRing.svelte';
	import { squircle } from '../internal/squircle.svelte.js';
	import type { IconComponent } from '../buttons/types.js';

	interface Props extends Omit<HTMLInputAttributes, 'value' | 'children'> {
		value?: string | null;
		/** Default (thin glass background) or subtle (no background). */
		appearance?: 'default' | 'subtle';
		icon?: IconComponent;
		/** The `<input>` element. */
		ref?: HTMLInputElement | null;
	}

	let {
		value = $bindable(''),
		appearance = 'default',
		icon,
		type = 'text',
		disabled = false,
		ref = $bindable(null),
		class: className,
		...rest
	}: Props = $props();

	let width = $state(0);
	let height = $state(0);

	/** Clicking the padding or icon focuses the input, like clicking a native field. */
	function focusInput(event: PointerEvent) {
		if (disabled || event.target === ref) return;
		event.preventDefault();
		ref?.focus();
	}
</script>

<div
	class={['og-text-input', className]}
	data-appearance={appearance}
	data-disabled={disabled ? '' : undefined}
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<!-- Pointer-only convenience: forwards clicks on the padding to the input, which
	     keyboard users reach directly. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="og-text-input-field og-surface"
		data-icon={icon ? '' : undefined}
		data-disabled={disabled ? '' : undefined}
		onpointerdown={focusInput}
		{@attach squircle()}
	>
		{#if icon}<Icon {icon} class="og-text-input-icon" />{/if}
		<input bind:this={ref} bind:value {type} {disabled} class="og-label" {...rest} />
	</div>
	<FocusRing {width} {height} radius={8} inner={appearance === 'default'} />
</div>

<style>
	.og-text-input {
		position: relative;
		display: flex;
		min-width: 0;
	}

	.og-text-input:focus-within > :global(.og-focus-ring) {
		opacity: 1;
	}

	.og-text-input-field {
		box-sizing: border-box;
		display: flex;
		flex: 1;
		align-items: center;
		gap: 6px;
		min-width: 0;
		height: 28px;
		padding: 6px 10px;
		color: var(--og-color-dark);
		cursor: text;
		--og-icon-size: 12px;
		--og-surface-hover: var(--og-color-dark-thin-glass);
		/* No press layer: clicking into a field focuses it, which the focus
		   indicator already shows (Inputs.md). */
		--og-surface-press: transparent;
	}

	.og-text-input[data-appearance='default'] > .og-text-input-field {
		--og-surface-bg: var(--og-color-dark-thin-glass);
	}

	.og-text-input-field[data-icon] {
		padding-left: 8px;
	}

	.og-text-input-field[data-disabled] {
		color: var(--og-color-dark-secondary);
		cursor: default;
	}

	/* The icon is secondary at rest and takes the text colour while focused. */
	.og-text-input-field > :global(.og-text-input-icon) {
		color: var(--og-color-dark-secondary);
	}

	.og-text-input:focus-within :global(.og-text-input-icon) {
		color: var(--og-color-dark);
	}

	input {
		flex: 1;
		min-width: 0;
		height: 16px;
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font-family: var(--og-font-sans);
		outline: none;
		appearance: none;
	}

	input::placeholder {
		color: var(--og-color-dark-secondary);
		opacity: 1;
	}

	input:disabled {
		color: inherit;
		-webkit-text-fill-color: currentColor;
	}

	/* Remove the native search clear button and number spinners' extra chrome. */
	input::-webkit-search-cancel-button {
		appearance: none;
	}
</style>
