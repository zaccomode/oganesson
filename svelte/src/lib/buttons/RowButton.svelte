<!--
@component
A full-width button for menus, navigation and forms (Buttons.md: Row Variant).
Optional secondary label and icon sit at the right: e.g. an item count, a
chevron for in-app navigation, or an external-link icon.

```svelte
<RowButton icon={Inbox} secondaryLabel="12" secondaryIcon={ChevronRight} href="/inbox">
	Inbox
</RowButton>
```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icons/Icon.svelte';
	import ButtonBase from './ButtonBase.svelte';
	import type { ButtonCommonProps, IconComponent } from './types.js';

	interface Props extends Omit<ButtonCommonProps, 'appearance' | 'elevated'> {
		/** The label. */
		children: Snippet;
		icon?: IconComponent;
		secondaryLabel?: string;
		secondaryIcon?: IconComponent;
	}

	let {
		children,
		icon,
		secondaryLabel,
		secondaryIcon,
		ref = $bindable(null),
		class: className,
		...rest
	}: Props = $props();
</script>

<ButtonBase
	layout="row"
	appearance="subtle"
	bind:ref
	{...rest}
	class={['og-button-row', className]}
	data-icon={icon ? 'left' : undefined}
>
	{#if icon}<Icon {icon} />{/if}
	<span class="og-label og-button-row-label">{@render children()}</span>
	{#if secondaryLabel}
		<span class="og-subtitle og-button-row-secondary">{secondaryLabel}</span>
	{/if}
	{#if secondaryIcon}
		<Icon icon={secondaryIcon} size={12} class="og-button-row-secondary" />
	{/if}
</ButtonBase>

<style>
	:global(.og-button-row-label) {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(.og-button-row .og-button-row-secondary) {
		color: var(--og-button-fg-secondary);
	}
</style>
