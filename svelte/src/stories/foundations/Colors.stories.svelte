<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import { Text, squircle } from '#lib';
	import { sameColor } from '../color.js';
	import { backgrounds, colors, type ColorToken } from '#lib/tokens.js';

	const { Story } = defineMeta({
		title: 'Foundations/Colors',
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Oganesson colours are opacity-based so surfaces can be layered. Every colour comes in four steps: solid, secondary (60%), thick glass and thin glass. Use them as `var(--og-color-<name>)`, e.g. `var(--og-color-primary-thin-glass)`.'
				}
			}
		}
	});

	const families = ['dark', 'white', 'primary', 'danger'] as const;
	const steps = ['', '-secondary', '-thick-glass', '-thin-glass'] as const;
</script>

{#snippet swatch(name: string, value: string, variable: string)}
	<figure class="swatch">
		<div
			class="chip"
			data-token={name}
			style:background={`var(${variable})`}
			{@attach squircle({
				effects: {
					innerBorder: { width: 1, color: 'rgb(33, 37, 43)', opacity: 0.059 }
				}
			})}
		></div>
		<figcaption>
			<Text variant="label" as="span">{name}</Text>
			<Text variant="caption" as="span">{value}</Text>
		</figcaption>
	</figure>
{/snippet}

<Story
	name="Palette"
	play={async ({ canvasElement }) => {
		const chip = canvasElement.querySelector<HTMLElement>('[data-token="primary"]')!;
		await expect(getComputedStyle(chip).backgroundColor).toBe('rgb(81, 85, 239)');
		const glass = canvasElement.querySelector<HTMLElement>('[data-token="dark-thin-glass"]')!;
		await expect(
			sameColor(getComputedStyle(glass).backgroundColor, colors['dark-thin-glass'])
		).toBe(true);
	}}
>
	<div class="palette">
		<section>
			<Text variant="subtitle" as="h2">Backgrounds</Text>
			<div class="row">
				{#each Object.entries(backgrounds) as [name, value] (name)}
					{@render swatch(`bg-${name}`, value, `--og-bg-${name}`)}
				{/each}
			</div>
		</section>
		{#each families as family (family)}
			<section>
				<Text variant="subtitle" as="h2">{family}</Text>
				<div class="row">
					{#each steps as step (step)}
						{@const name = `${family}${step}` as ColorToken}
						{@render swatch(name, colors[name], `--og-color-${name}`)}
					{/each}
				</div>
			</section>
		{/each}
		<section>
			<Text variant="subtitle" as="h2">Gradient stops</Text>
			<div class="row">
				{@render swatch('dark-bright', colors['dark-bright'], '--og-color-dark-bright')}
				{@render swatch('dark-deep', colors['dark-deep'], '--og-color-dark-deep')}
			</div>
		</section>
	</div>
</Story>

<style>
	.palette {
		display: grid;
		gap: 24px;
	}
	section {
		display: grid;
		gap: 8px;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}
	.swatch {
		margin: 0;
		display: grid;
		gap: 6px;
		width: 120px;
	}
	.chip {
		height: 64px;
		border-radius: var(--og-radius);
	}
	figcaption {
		display: grid;
		gap: 2px;
	}
</style>
