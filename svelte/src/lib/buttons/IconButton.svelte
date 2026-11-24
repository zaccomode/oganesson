<!--
@component
An icon-only button (Buttons.md: Icon Variant). `label` is required: it's the
accessible name and the tooltip text. The tooltip shows above after 500ms by
default; make it `instant`, put it `below`, or turn it off with
`tooltip={false}` where labels are unnecessary.

```svelte
<IconButton icon={Trash2} label="Delete" colorway="danger" />
<IconButton icon={X} label="Close" size="small" tooltip={false} />
```
-->
<script lang="ts">
	import Icon from '../icons/Icon.svelte';
	import Tooltip from '../tooltip/Tooltip.svelte';
	import ButtonBase from './ButtonBase.svelte';
	import type { ButtonCommonProps, IconComponent } from './types.js';
	import { mergeProps } from 'svelte-toolbelt';

	interface Props extends ButtonCommonProps {
		icon: IconComponent;
		/** Accessible name and tooltip text. */
		label: string;
		/** Regular (28px) or small (20px). */
		size?: 'regular' | 'small';
		/** `true` (default), `'instant'` to skip the delay, or `false` for none. */
		tooltip?: boolean | 'instant';
		tooltipSide?: 'top' | 'bottom';
	}

	let {
		icon,
		label,
		size = 'regular',
		tooltip = true,
		tooltipSide = 'top',
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const tooltipColorway = $derived(
		rest.appearance === 'prominent' ? 'dark' : (rest.colorway ?? 'dark')
	);
</script>

{#snippet button(triggerProps: Record<string, unknown>)}
	<ButtonBase layout="icon" {size} bind:ref {...mergeProps(rest, triggerProps)} aria-label={label}>
		<Icon {icon} />
	</ButtonBase>
{/snippet}

{#if tooltip && !rest.disabled}
	<Tooltip
		text={label}
		side={tooltipSide}
		instant={tooltip === 'instant'}
		colorway={tooltipColorway}
		trigger={button}
	/>
{:else}
	{@render button({})}
{/if}
