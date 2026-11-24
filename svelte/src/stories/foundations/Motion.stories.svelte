<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import { Text, squircle } from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Foundations/Motion',
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Interaction animations (Animations.md). Hover and press colours appear instantly and fade out slowly: 500ms after hover, 1000ms after press, eased with `cubic-bezier(0.16, 1, 0.3, 1)`. The hover and press effects are separate layers, so they stack on an active surface. Add the `og-surface` class to opt an element in; set `data-og-active` for the active state. With reduced motion, every duration is zero.'
				}
			}
		}
	});
</script>

<Story
	name="Interaction surface"
	play={async ({ canvasElement }) => {
		const [plain, active, disabled] = canvasElement.querySelectorAll<HTMLElement>('.og-surface');
		const hover = getComputedStyle(plain, '::before');
		const press = getComputedStyle(plain, '::after');
		const label = getComputedStyle(plain.firstElementChild!);
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

		await expect(hover.opacity).toBe('0');
		await expect(sameColor(hover.backgroundColor, colors['dark-thin-glass'])).toBe(true);
		await expect(hover.transitionDuration).toBe(reduced ? '0s' : '0.5s');
		await expect(sameColor(press.backgroundColor, colors['dark-thick-glass'])).toBe(true);
		await expect(press.transitionDuration).toBe(reduced ? '0s' : '1s');

		// Layers stack above the surface's own background and below its content, with
		// no negative z-index (Safari paints those under an element's background).
		await expect([hover.zIndex, press.zIndex, label.zIndex]).toEqual(['0', '0', '1']);

		await expect(getComputedStyle(plain).backgroundColor).toBe('rgba(0, 0, 0, 0)');
		await expect(
			sameColor(getComputedStyle(active).backgroundColor, colors['dark-thin-glass'])
		).toBe(true);
		await expect((disabled as HTMLButtonElement).disabled).toBe(true);
	}}
>
	<div class="demo">
		<button class="og-surface og-label" {@attach squircle()}><span>Hover or press me</span></button>
		<button class="og-surface og-label" data-og-active {@attach squircle()}>
			<span>Active</span>
		</button>
		<button class="og-surface og-label" disabled {@attach squircle()}><span>Disabled</span></button>
	</div>
	<Text variant="small-label">
		Move the pointer off a surface to see the slow fade; press and release to see the longer press
		fade. Hovering the active surface stacks another layer of glass on it.
	</Text>
</Story>

<style>
	.demo {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
	}
	button {
		appearance: none;
		border: 0;
		font: inherit;
		color: var(--og-color-dark);
		padding: 6px 10px;
		cursor: pointer;
	}
	button:disabled {
		color: var(--og-color-dark-secondary);
		cursor: default;
	}
</style>
