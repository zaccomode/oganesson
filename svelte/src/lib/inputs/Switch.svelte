<!--
@component
An on/off switch (design/Inputs/Inputs.md: Switches), built on Bits UI.

Pair it with a visible label (usually to its left). Use a checkbox instead for
lists of options or where the state may be indeterminate.

```svelte
<label for="notify">Notifications</label>
<Switch id="notify" bind:checked={notify} />
<Switch bind:checked={dark} aria-label="Dark mode" />
```
-->
<script lang="ts">
	import { Switch } from 'bits-ui';
	import FocusRing from '../internal/FocusRing.svelte';
	import { squircle } from '../internal/squircle.svelte.js';

	type Props = Omit<Switch.RootProps, 'child' | 'children'>;

	let {
		checked = $bindable(false),
		ref = $bindable(null),
		disabled = false,
		class: className,
		...rest
	}: Props = $props();
</script>

<span class={['og-switch', className]} data-disabled={disabled ? '' : undefined}>
	<Switch.Root
		bind:checked
		bind:ref
		{disabled}
		{...rest}
		class="og-switch-track og-surface"
		{@attach squircle()}
	>
		<Switch.Thumb class="og-switch-thumb" {@attach squircle()} />
	</Switch.Root>
	<FocusRing width={52} height={24} radius={12} />
</span>

<style>
	.og-switch {
		position: relative;
		display: inline-flex;
		flex: none;
		vertical-align: middle;
	}

	.og-switch[data-disabled] {
		opacity: 0.5;
	}

	.og-switch:has(> :global(.og-switch-track:focus-visible)) > :global(.og-focus-ring) {
		opacity: 1;
	}

	/* Switch.sketchframe: a 52×24 pill with 4px inset and a 24×16 pill thumb. */
	:global(.og-switch-track) {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		width: 52px;
		height: 24px;
		margin: 0;
		padding: 4px;
		border: 0;
		border-radius: 12px;
		cursor: pointer;
		outline: none;
		-webkit-tap-highlight-color: transparent;
		transition: background-color var(--og-duration-movement) var(--og-ease-movement);
		--og-surface-bg: var(--og-color-dark-thin-glass);
		--og-surface-hover: var(--og-color-dark-thin-glass);
		--og-surface-press: var(--og-color-dark-thick-glass);
	}

	/* On: a dark track, so hover and press lighten it instead. */
	:global(.og-switch-track[aria-checked='true']) {
		--og-surface-bg: var(--og-color-dark);
		--og-surface-hover: var(--og-color-white-thin-glass);
		--og-surface-press: var(--og-color-white-thick-glass);
	}

	:global(.og-switch-track:disabled) {
		cursor: default;
	}

	:global(.og-switch-thumb) {
		display: block;
		width: 24px;
		height: 16px;
		border-radius: 8px;
		background-color: var(--og-color-dark);
		pointer-events: none;
		transition:
			translate var(--og-duration-movement) var(--og-ease-movement),
			background-color var(--og-duration-movement) var(--og-ease-movement);
	}

	:global(.og-switch-track[aria-checked='true'] > .og-switch-thumb) {
		translate: 20px 0;
		background-color: var(--og-color-white);
	}
</style>
