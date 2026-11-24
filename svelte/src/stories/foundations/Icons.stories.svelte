<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import { Bell, Search, Trash2 } from '@lucide/svelte';
	import { Icon, Text } from '#lib';
	import FilledStar from './FilledStar.svelte';

	const { Story } = defineMeta({
		title: 'Foundations/Icons',
		component: Icon,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'`<Icon>` takes any Svelte icon component (Lucide is the default choice; Phosphor, Tabler and others work too) or raw SVG, then sizes it to `--og-icon-size` (14px unless a component sets otherwise) and colours it with the surrounding text colour through `currentColor`. Icons are decorative unless given a `label`. Swap the icons Oganesson draws itself with `setOganessonIcons()`.'
				}
			}
		}
	});
</script>

<Story
	asChild
	name="Sizing and colour"
	play={async ({ canvasElement }) => {
		for (const svg of canvasElement.querySelectorAll<SVGSVGElement>('[data-case="default"] svg')) {
			const box = svg.getBoundingClientRect();
			await expect([box.width, box.height]).toEqual([14, 14]);
		}
		const sized = canvasElement.querySelector('[data-case="24"] svg')!.getBoundingClientRect();
		await expect(sized.width).toBe(24);

		const danger = canvasElement.querySelector<SVGSVGElement>('[data-case="danger"] svg')!;
		await expect(getComputedStyle(danger).color).toBe('rgb(206, 30, 12)');

		const labelled = canvasElement.querySelector('[data-case="labelled"] .og-icon')!;
		await expect(labelled.getAttribute('role')).toBe('img');
		await expect(labelled.getAttribute('aria-label')).toBe('Notifications');
	}}
>
	<div class="grid">
		<div class="row" data-case="default">
			<Icon icon={Search} />
			<Icon icon={Trash2} />
			<Icon icon={FilledStar} />
			<Icon>
				<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" /></svg>
			</Icon>
			<Text variant="caption" as="span">14px default · Lucide, another library, raw SVG</Text>
		</div>
		<div class="row">
			{#each [14, 16, 20] as size (size)}
				<Icon icon={Search} {size} />
			{/each}
			<span data-case="24"><Icon icon={Search} size={24} /></span>
			<Text variant="caption" as="span">size prop · 14 / 16 / 20 / 24</Text>
		</div>
		<div class="row" style:color="var(--og-color-primary)">
			<Icon icon={Bell} />
			<Icon icon={FilledStar} />
			<Text variant="label" as="span">Inherits primary</Text>
		</div>
		<div class="row" style:color="var(--og-color-danger)" data-case="danger">
			<Icon icon={Trash2} />
			<Text variant="label" as="span">Inherits danger</Text>
		</div>
		<div class="row" data-case="labelled">
			<Icon icon={Bell} label="Notifications" />
			<Text variant="caption" as="span">labelled: role="img"</Text>
		</div>
	</div>
</Story>

<style>
	.grid {
		display: grid;
		gap: 16px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 12px;
	}
</style>
