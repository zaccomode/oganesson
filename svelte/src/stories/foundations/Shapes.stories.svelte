<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import { Text, squircle } from '#lib';

	const { Story } = defineMeta({
		title: 'Foundations/Shapes',
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Rounded corners use smooth "squircle" corners from 8px up (Shapes.md), drawn with Lisse. Add `{@attach squircle()}` to any element with a CSS `border-radius`; it takes the radius from CSS and keeps plain rounded corners until it hydrates. `clip-path` cuts off CSS borders, shadows and outlines, so pass those as `effects`.'
				}
			}
		}
	});

	const radii = [8, 16, 32];
</script>

<Story
	name="Squircle vs. rounded rectangle"
	play={async ({ canvasElement }) => {
		const smooth = canvasElement.querySelector<HTMLElement>('[data-shape="squircle-16"]')!;
		await waitFor(() => expect(getComputedStyle(smooth).clipPath).toMatch(/^path\(/));
		await expect(smooth.style.borderRadius).toBe('0px');

		const small = canvasElement.querySelector<HTMLElement>('[data-shape="small"]')!;
		await expect(getComputedStyle(small).clipPath).toBe('none');
		await expect(getComputedStyle(small).borderTopLeftRadius).toBe('4px');
	}}
>
	<div class="grid">
		{#each radii as radius (radius)}
			<div class="pair">
				<div class="box" style:border-radius="{radius}px" data-shape="rounded-{radius}"></div>
				<div
					class="box"
					style:border-radius="{radius}px"
					data-shape="squircle-{radius}"
					{@attach squircle()}
				></div>
				<div class="overlay">
					<div class="box ghost" style:border-radius="{radius}px"></div>
					<div class="box ghost smooth" style:border-radius="{radius}px" {@attach squircle()}></div>
				</div>
				<Text variant="caption" as="span">{radius}px · rounded / smooth / overlaid</Text>
			</div>
		{/each}
		<div class="pair">
			<div class="box" style:border-radius="4px" data-shape="small" {@attach squircle()}></div>
			<Text variant="caption" as="span">4px · stays a plain CSS radius</Text>
		</div>
	</div>
</Story>

<style>
	.grid {
		display: grid;
		gap: 24px;
	}
	.pair {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.box {
		width: 120px;
		height: 120px;
		background: var(--og-color-dark);
	}
	.overlay {
		position: relative;
		width: 120px;
		height: 120px;
	}
	.ghost {
		position: absolute;
		inset: 0;
		background: var(--og-color-danger-secondary);
	}
	.ghost.smooth {
		background: var(--og-color-primary-secondary);
	}
</style>
