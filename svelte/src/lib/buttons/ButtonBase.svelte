<!--
@component
Internal: the shared structure and styling for Button, IconButton and RowButton
(design/Buttons/Buttons.md).

    span.og-button-shell      prominent hover: rises 2px; drop shadow layer
      span.og-button-frame    prominent press: pushes back down 2px; holds Lisse
                              overlays and the focus ring so they move with it
        button|a.og-button    squircle-clipped surface with hover/press layers

Movement lives on the wrappers because Lisse's border overlays are siblings of
the button and don't follow transforms applied to the button itself.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { EffectsConfig } from '@lisse/svelte';
	import FocusRing from '../internal/FocusRing.svelte';
	import { squircle } from '../internal/squircle.svelte.js';
	import type { ButtonCommonProps } from './types.js';

	interface Props extends ButtonCommonProps {
		layout: 'default' | 'icon' | 'row';
		size?: 'regular' | 'small';
		children?: Snippet;
	}

	let {
		layout,
		size = 'regular',
		appearance = 'subtle',
		colorway = 'dark',
		active = false,
		elevated = false,
		disabled = false,
		href,
		ref = $bindable(null),
		type,
		class: className,
		children,
		...rest
	}: Props = $props();

	let width = $state(0);
	let height = $state(0);

	const prominent = $derived(appearance === 'prominent');
	const radius = $derived(size === 'small' ? 6 : 8);

	// Prominent edge (Buttons-Button (Prominent).sketchframe): a 1px white highlight
	// fading out towards the bottom, under a 0.5px near-black rim.
	const prominentEffects: EffectsConfig = {
		innerBorder: {
			width: 1,
			opacity: 1,
			color: {
				type: 'linear',
				angle: 180,
				stops: [
					{ offset: 0, color: '#ffffff', opacity: 0.302 },
					{ offset: 0.9964, color: '#ffffff', opacity: 0 }
				]
			}
		},
		middleBorder: { width: 1, color: '#090a0c', opacity: 1 }
	};

	const element = $derived(href === undefined ? 'button' : 'a');
	const elementAttributes = $derived(
		element === 'button'
			? { type: type ?? 'button', disabled }
			: {
					href: disabled ? undefined : href,
					'aria-disabled': disabled ? ('true' as const) : undefined,
					role: disabled ? 'link' : undefined,
					tabindex: disabled ? -1 : undefined
				}
	);
</script>

<span
	class="og-button-shell"
	data-appearance={appearance}
	data-layout={layout}
	data-elevated={prominent && elevated ? '' : undefined}
	data-disabled={disabled ? '' : undefined}
>
	<span class="og-button-frame" bind:clientWidth={width} bind:clientHeight={height}>
		<svelte:element
			this={element}
			bind:this={ref}
			{...rest}
			{...elementAttributes}
			class={['og-button', 'og-surface', className]}
			data-appearance={appearance}
			data-colorway={prominent ? undefined : colorway}
			data-layout={layout}
			data-size={size}
			data-og-active={active && !prominent ? '' : undefined}
			data-disabled={disabled ? '' : undefined}
			{@attach squircle(() => ({ radius, effects: prominent ? prominentEffects : undefined }))}
		>
			{@render children?.()}
		</svelte:element>
		<FocusRing {width} {height} {radius} />
	</span>
</span>

<style>
	/* ── Structure ─────────────────────────────────────────────────────────── */

	.og-button-shell {
		position: relative;
		display: inline-flex;
		vertical-align: middle;
		max-width: 100%;
		transition: translate var(--og-duration-hover-out) var(--og-ease-out);
	}

	.og-button-shell[data-layout='row'] {
		display: flex;
		width: 100%;
	}

	.og-button-frame {
		position: relative;
		display: flex;
		flex: 1;
		min-width: 0;
		transition: translate var(--og-duration-press-out) var(--og-ease-out);
	}

	.og-button-frame:has(> .og-button:focus-visible) > :global(.og-focus-ring) {
		opacity: 1;
	}

	.og-button {
		appearance: none;
		box-sizing: border-box;
		display: flex;
		flex: 1;
		align-items: center;
		gap: 6px;
		min-width: 0;
		margin: 0;
		border: 0;
		font: inherit;
		font-family: var(--og-font-sans);
		color: var(--og-button-fg);
		text-align: left;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.og-button:focus-visible {
		outline: none;
	}

	.og-button[data-disabled] {
		color: var(--og-button-fg-secondary);
		cursor: default;
	}

	/* ── Layouts (sizes from the Sketch files) ─────────────────────────────── */

	.og-button[data-layout='default'],
	.og-button[data-layout='row'] {
		padding: 6px 10px;
		--og-icon-size: 14px;
	}

	/* The Sketch files tighten the padding on the icon's side by 2px. */
	.og-button[data-icon='left'] {
		padding-left: 8px;
	}

	.og-button[data-icon='right'] {
		padding-right: 8px;
	}

	.og-button[data-layout='icon'] {
		justify-content: center;
		padding: 6px;
		--og-icon-size: 16px;
	}

	.og-button[data-layout='icon'][data-size='small'] {
		padding: 4px;
		border-radius: 6px;
		--og-icon-size: 12px;
	}

	/* ── Subtle colourways ─────────────────────────────────────────────────── */

	.og-button[data-colorway='dark'] {
		--og-button-fg: var(--og-color-dark);
		--og-button-fg-secondary: var(--og-color-dark-secondary);
		--og-surface-hover: var(--og-color-dark-thin-glass);
		--og-surface-press: var(--og-color-dark-thick-glass);
		--og-surface-bg-active: var(--og-color-dark-thin-glass);
	}

	.og-button[data-colorway='primary'] {
		--og-button-fg: var(--og-color-primary);
		--og-button-fg-secondary: var(--og-color-primary-secondary);
		--og-surface-hover: var(--og-color-primary-thin-glass);
		--og-surface-press: var(--og-color-primary-thick-glass);
		--og-surface-bg-active: var(--og-color-primary-thin-glass);
	}

	.og-button[data-colorway='danger'] {
		--og-button-fg: var(--og-color-danger);
		--og-button-fg-secondary: var(--og-color-danger-secondary);
		--og-surface-hover: var(--og-color-danger-thin-glass);
		--og-surface-press: var(--og-color-danger-thick-glass);
		--og-surface-bg-active: var(--og-color-danger-thin-glass);
	}

	/* ── Prominent ─────────────────────────────────────────────────────────── */

	.og-button[data-appearance='prominent'] {
		--og-button-fg: var(--og-color-white);
		--og-button-fg-secondary: var(--og-color-white-secondary);
		/* Prominent buttons don't change colour on hover; pressing lightens them. */
		--og-surface-hover: transparent;
		--og-surface-press: var(--og-color-white-thick-glass);
		/* One-off gradient for prominent buttons (Buttons.md), not palette colours. */
		background-image: linear-gradient(180deg, #3f434a 0%, #090a0c 100%);
	}

	.og-button-shell[data-appearance='prominent'][data-disabled] {
		opacity: 0.5;
	}

	.og-button-shell[data-appearance='prominent'] > .og-button-frame > .og-button[data-disabled] {
		color: var(--og-button-fg);
	}

	/* Drop shadow: behind the button, shown when elevated or hovered. The shadow is
	   20-50px of blur, so a rounded rectangle is indistinguishable from the squircle. */
	.og-button-shell[data-appearance='prominent']::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--og-radius);
		box-shadow: var(--og-shadow-elevated);
		pointer-events: none;
		opacity: 0;
		transition: opacity var(--og-duration-hover-out) var(--og-ease-out);
	}

	.og-button-shell[data-appearance='prominent'][data-elevated]::before {
		opacity: 1;
	}

	/* Keeps the pointer "over" the button while it's raised, so it doesn't flicker
	   between hovered and not when the pointer is near its bottom edge. */
	.og-button-shell[data-appearance='prominent']::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -2px;
		height: 2px;
	}

	@media (hover: hover) {
		.og-button-shell[data-appearance='prominent']:not([data-disabled]):hover {
			translate: 0 -2px;
			transition-duration: 0s;
		}

		.og-button-shell[data-appearance='prominent']:not([data-disabled]):hover::before {
			opacity: 1;
			transition-duration: 0s;
		}
	}

	.og-button-shell[data-appearance='prominent']:not([data-disabled])
		> .og-button-frame:has(> .og-button:active) {
		translate: 0 2px;
		transition-duration: 0s;
	}
</style>
