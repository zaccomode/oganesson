<!--
@component
A button with a label and an optional icon on either side (Buttons.md: Default
Variant). Subtle by default; `appearance="prominent"` for the one recommended
action on screen.

```svelte
<Button onclick={save}>Save</Button>
<Button appearance="prominent" icon={Plus}>New project</Button>
<Button colorway="danger" icon={Trash2} iconPosition="right">Delete</Button>
<Button href="/settings" active>Settings</Button>
```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icons/Icon.svelte';
	import ButtonBase from './ButtonBase.svelte';
	import type { ButtonCommonProps, IconComponent } from './types.js';

	interface Props extends ButtonCommonProps {
		/** The label. */
		children: Snippet;
		icon?: IconComponent;
		iconPosition?: 'left' | 'right';
	}

	let {
		children,
		icon,
		iconPosition = 'left',
		ref = $bindable(null),
		class: className,
		...rest
	}: Props = $props();
</script>

<ButtonBase
	layout="default"
	bind:ref
	{...rest}
	class={['og-button-default', className]}
	data-icon={icon ? iconPosition : undefined}
>
	{#if icon && iconPosition === 'left'}<Icon {icon} />{/if}
	<span class="og-label">{@render children()}</span>
	{#if icon && iconPosition === 'right'}<Icon {icon} />{/if}
</ButtonBase>
