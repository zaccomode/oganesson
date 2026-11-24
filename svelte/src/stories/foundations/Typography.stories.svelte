<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import { Text } from '#lib';
	import { typography, type TextVariant } from '#lib/tokens.js';

	const { Story } = defineMeta({
		title: 'Foundations/Typography',
		component: Text,
		tags: ['autodocs'],
		argTypes: {
			variant: { control: 'select', options: Object.keys(typography) }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Seven text styles: Instrument Sans for titles and labels, Geist Mono in uppercase for subtitles and captions. Use `<Text variant>` or the `og-<variant>` classes.'
				}
			}
		}
	});

	const samples: Record<TextVariant, string> = {
		'large-title': 'This is a Large Title',
		title: 'This is a Standard Title',
		'title-2': 'This is a Second-Tier Title',
		label: 'This is a standard label.',
		'small-label': 'This is a small label.',
		subtitle: 'This is a subtitle',
		caption: 'This is a caption'
	};
	const variants = Object.keys(typography) as TextVariant[];
</script>

<Story
	asChild
	name="Scale"
	play={async ({ canvasElement }) => {
		await document.fonts.ready;
		for (const variant of variants) {
			const el = canvasElement.querySelector<HTMLElement>(`[data-variant="${variant}"]`)!;
			const style = getComputedStyle(el);
			const spec = typography[variant];
			await expect(style.fontSize).toBe(`${spec.size}px`);
			await expect(style.lineHeight).toBe(`${spec.lineHeight}px`);
			await expect(style.fontWeight).toBe(String(spec.weight));
			await expect(style.fontFamily).toMatch(
				spec.font === 'mono' ? /Geist Mono/ : /Instrument Sans/
			);
			await expect(
				document.fonts.check(
					`${spec.weight} ${spec.size}px "${spec.font === 'mono' ? 'Geist Mono' : 'Instrument Sans'}"`
				)
			).toBe(true);
		}
	}}
>
	<div class="scale">
		{#each variants as variant (variant)}
			<div class="row">
				<Text variant="caption" as="span" class="meta">
					{variant} · {typography[variant].size}/{typography[variant].lineHeight} · {typography[
						variant
					].weight}
				</Text>
				<!-- Render as plain elements here so the page doesn't contain seven h1s. -->
				<Text {variant} as="div" data-variant={variant}>{samples[variant]}</Text>
			</div>
		{/each}
	</div>
</Story>

<Story name="Playground" args={{ variant: 'title', as: 'div' }}>
	{#snippet template(args)}
		<Text {...args}>The quick brown fox jumps over the lazy dog</Text>
	{/snippet}
</Story>

<style>
	.scale {
		display: grid;
		gap: 16px;
	}
	.row {
		display: grid;
		gap: 4px;
	}
</style>
