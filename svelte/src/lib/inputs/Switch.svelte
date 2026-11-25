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
		onpointerdown,
		...rest
	}: Props = $props();

	// Inputs.md (Switch States, Press): while the pointer is held down the thumb
	// stretches towards where it will travel, and it only moves on release.
	// Tracked in script rather than with :active so it also works on iOS Safari
	// and ends wherever the pointer is released.
	let pressed = $state(false);

	const press: typeof onpointerdown = (event) => {
		onpointerdown?.(event);
		if (disabled || event.defaultPrevented || !event.isPrimary || event.button !== 0) return;
		pressed = true;
	};

	function release() {
		pressed = false;
	}
</script>

<svelte:window onpointerup={release} onpointercancel={release} onblur={release} />

<span
	class={['og-switch', className]}
	data-disabled={disabled ? '' : undefined}
	data-pressed={pressed ? '' : undefined}
>
	<Switch.Root
		bind:checked
		bind:ref
		{disabled}
		{...rest}
		onpointerdown={press}
		class="og-switch-track og-surface"
		{@attach squircle()}
	>
		<!--
			No squircle on the thumb: it's a pill, where smoothing has no room and
			Lisse draws plain arcs anyway. Its clip-path also trails a resize by a
			frame or two, which shaved the leading edge while the thumb stretched.
		-->
		<Switch.Thumb class="og-switch-thumb" />
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
		transition-duration: 0s;
	}

	/*
	 * Inputs-Switch.sketchframe: a 52×24 pill with 4px inset and a 24×16 pill
	 * thumb, so the thumb travels 20px.
	 */
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
		/* No press layer: pressing stretches the thumb instead (see below). */
		--og-surface-press: transparent;
	}

	/* On: a dark track, so hover lightens it instead. */
	:global(.og-switch-track[aria-checked='true']) {
		--og-surface-bg: var(--og-color-dark);
		--og-surface-hover: var(--og-color-white-thin-glass);
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
			width var(--og-duration-movement) var(--og-ease-movement),
			background-color var(--og-duration-movement) var(--og-ease-movement);
	}

	:global(.og-switch-track[aria-checked='true'] > .og-switch-thumb) {
		translate: 20px 0;
		background-color: var(--og-color-white);
	}

	/*
	 * Pressed: the thumb stretches 10px towards the side it will travel to,
	 * keeping its far edge in place. Off, it grows rightwards; on, it grows
	 * leftwards (it moves 10px left as it widens). On release it slides across
	 * and shrinks back in one movement.
	 */
	.og-switch[data-pressed] > :global(.og-switch-track > .og-switch-thumb) {
		width: 34px;
	}

	.og-switch[data-pressed] > :global(.og-switch-track[aria-checked='true'] > .og-switch-thumb) {
		translate: 10px 0;
	}
</style>
