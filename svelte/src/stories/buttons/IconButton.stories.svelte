<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, waitFor, within } from 'storybook/test';
	import { Bell, Pencil, Search, Settings, Trash2 } from '@lucide/svelte';
	import { IconButton, TooltipProvider } from '#lib';

	const { Story } = defineMeta({
		title: 'Buttons/IconButton',
		component: IconButton,
		tags: ['autodocs'],
		argTypes: {
			appearance: { control: 'inline-radio', options: ['subtle', 'prominent'] },
			colorway: { control: 'inline-radio', options: ['dark', 'primary', 'danger'] },
			size: { control: 'inline-radio', options: ['regular', 'small'] },
			tooltip: { control: 'inline-radio', options: [true, 'instant', false] },
			tooltipSide: { control: 'inline-radio', options: ['top', 'bottom'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Icon-only buttons always take a `label`: it names the button for assistive tech and is shown as a tooltip after 500ms of hover. Wrap a group of them (or your app) in `<TooltipProvider>` so moving between buttons within 500ms shows the next tooltip immediately.'
				}
			}
		}
	});

	const colorways = ['dark', 'primary', 'danger'] as const;
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
</script>

<Story name="Playground" args={{ icon: Settings, label: 'Settings' }}>
	{#snippet template(args)}
		<div class="pad"><IconButton {...args} icon={Settings} label={args.label ?? 'Settings'} /></div>
	{/snippet}
</Story>

<Story
	name="Sizes and colourways"
	asChild
	play={async ({ canvasElement }) => {
		const regular = canvasElement.querySelector<HTMLElement>('[data-case="regular"] .og-button')!;
		await expect(regular.getBoundingClientRect()).toMatchObject({ width: 30, height: 30 });
		await expect(regular.querySelector('svg')!.getBoundingClientRect().width).toBe(18);
		await expect(regular.getAttribute('aria-label')).toBe('Edit');

		const small = canvasElement.querySelector<HTMLElement>('[data-case="small"] .og-button')!;
		await expect(small.getBoundingClientRect()).toMatchObject({ width: 24, height: 24 });
		await expect(small.querySelector('svg')!.getBoundingClientRect().width).toBe(12);
		await expect(getComputedStyle(small).borderTopLeftRadius).toBe('6px');
	}}
>
	<div class="grid">
		{#each colorways as colorway (colorway)}
			<span data-case={colorway === 'dark' ? 'regular' : undefined}>
				<IconButton icon={Pencil} label="Edit" {colorway} />
			</span>
			<IconButton icon={Pencil} label="Edit" {colorway} active />
			<span data-case={colorway === 'dark' ? 'small' : undefined}>
				<IconButton icon={Pencil} label="Edit" {colorway} size="small" />
			</span>
			<IconButton icon={Pencil} label="Edit" {colorway} size="small" active />
		{/each}
		<IconButton icon={Pencil} label="Edit" appearance="prominent" />
		<IconButton icon={Pencil} label="Edit" appearance="prominent" elevated />
		<IconButton icon={Pencil} label="Edit" disabled />
		<IconButton icon={Pencil} label="Edit" appearance="prominent" disabled />
	</div>
</Story>

<Story
	name="Tooltips"
	asChild
	play={async ({ canvasElement }) => {
		const body = within(document.body);
		const [search, bell, trash] = canvasElement.querySelectorAll<HTMLElement>('.og-button');

		// 500ms delay before the first tooltip.
		await userEvent.hover(search);
		await sleep(300);
		await expect(body.queryByText('Search')).toBeNull();
		const tip = await body.findByText('Search', {}, { timeout: 1000 });
		await expect(tip.closest('.og-tooltip')).not.toBeNull();

		// Above by default, 2px from the button (once positioned).
		await waitFor(() =>
			expect(
				Math.round(search.getBoundingClientRect().top - tip.getBoundingClientRect().bottom)
			).toBe(2)
		);

		// Moving to another button within 500ms shows its tooltip straight away,
		// even after a 400ms gap.
		await userEvent.unhover(search);
		await sleep(400);
		await userEvent.hover(bell);
		await waitFor(() => expect(body.getByText('Notifications')).toBeTruthy(), { timeout: 150 });

		// After the hand-off window, the full delay applies again.
		await userEvent.unhover(bell);
		await sleep(800);
		await userEvent.hover(trash);
		await sleep(300);
		await expect(body.queryByText('Delete')).toBeNull();

		// Below, in the danger colourway.
		const below = await body.findByText('Delete', {}, { timeout: 1000 });
		await waitFor(() =>
			expect(
				Math.round(below.getBoundingClientRect().top - trash.getBoundingClientRect().bottom)
			).toBe(2)
		);
		await userEvent.unhover(trash);
	}}
>
	<TooltipProvider>
		<div class="row pad">
			<IconButton icon={Search} label="Search" />
			<IconButton icon={Bell} label="Notifications" colorway="primary" />
			<IconButton icon={Trash2} label="Delete" colorway="danger" tooltipSide="bottom" />
			<IconButton icon={Settings} label="Settings" tooltip="instant" />
			<IconButton icon={Pencil} label="Edit" tooltip={false} />
		</div>
	</TooltipProvider>
</Story>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(4, max-content);
		gap: 20px 24px;
		align-items: center;
	}
	.row {
		display: flex;
		gap: 12px;
	}
	.pad {
		padding: 32px 0;
	}
</style>
