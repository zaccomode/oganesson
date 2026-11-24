<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import { ChevronRight, ExternalLink, Inbox, LogOut, Star } from '@lucide/svelte';
	import { RowButton } from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Buttons/RowButton',
		component: RowButton,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Full-width buttons for menus, navigation and forms (Buttons.md: Row Variant). An optional secondary label (e.g. a count) and secondary icon (e.g. a chevron for in-app navigation, or external-link) sit at the right.'
				}
			}
		}
	});

	const colorways = ['dark', 'danger', 'primary'] as const;
</script>

<Story
	name="Colourways"
	asChild
	play={async ({ canvasElement }) => {
		const column = canvasElement.querySelector<HTMLElement>('.column')!;
		const row = canvasElement.querySelector<HTMLElement>('[data-case="dark"] .og-button')!;
		await expect(row.getBoundingClientRect().width).toBe(column.getBoundingClientRect().width);
		await expect(row.getBoundingClientRect().height).toBe(30);
		await expect(getComputedStyle(row).paddingLeft).toBe('8px');

		const secondary = row.querySelector<HTMLElement>('.og-subtitle')!;
		await expect(sameColor(getComputedStyle(secondary).color, colors['dark-secondary'])).toBe(true);
		const secondaryIcon = row.querySelectorAll('svg')[1];
		await expect(secondaryIcon.getBoundingClientRect().width).toBe(14);

		const primary = canvasElement.querySelector<HTMLElement>('[data-case="primary"] .og-subtitle')!;
		await expect(sameColor(getComputedStyle(primary).color, colors['primary-secondary'])).toBe(
			true
		);
	}}
>
	<div class="column">
		{#each colorways as colorway (colorway)}
			<div class="pair" data-case={colorway}>
				<RowButton {colorway} icon={Star} secondaryLabel="01" secondaryIcon={ChevronRight}>
					Oganesson
				</RowButton>
				<RowButton {colorway} icon={Star} secondaryLabel="01" secondaryIcon={ChevronRight} active>
					Oganesson
				</RowButton>
			</div>
		{/each}
	</div>
</Story>

<Story name="Navigation" asChild>
	<nav class="column">
		<RowButton href="#inbox" icon={Inbox} secondaryLabel="12" active>Inbox</RowButton>
		<RowButton href="#starred" icon={Star} secondaryLabel="3">Starred</RowButton>
		<RowButton href="https://example.com" icon={ExternalLink} secondaryIcon={ExternalLink}>
			Help centre
		</RowButton>
		<RowButton colorway="danger" icon={LogOut}>Sign out</RowButton>
		<RowButton icon={Star} disabled>Unavailable</RowButton>
	</nav>
</Story>

<style>
	.column {
		display: grid;
		gap: 8px;
		width: 220px;
	}
	.pair {
		display: grid;
		gap: 8px;
		margin-bottom: 24px;
	}
</style>
