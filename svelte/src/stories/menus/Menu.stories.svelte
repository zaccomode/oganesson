<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, spyOn, userEvent, waitFor } from 'storybook/test';
	import {
		Archive,
		Copy,
		Ellipsis,
		ExternalLink,
		FolderInput,
		Pencil,
		Share,
		Star,
		Trash2
	} from '@lucide/svelte';
	import { Button, IconButton, Menu, MenuItem, Text, type MenuAlign, type MenuSide } from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Menus/Menu',
		component: Menu,
		tags: ['autodocs'],
		argTypes: {
			side: { control: 'inline-radio', options: ['bottom', 'top', 'left', 'right'] },
			align: { control: 'inline-radio', options: ['end', 'center', 'start'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A list of secondary or overflowing actions (Menus.md), opened from any trigger, typically a button. Items are row buttons with a unique icon and label; keep it to 6. The elevated Acrylic container opens 2px from the trigger, **below and right-aligned** by default, on any `side` with any `align`, and moves to stay entirely in view. Arrow keys move through the items, and typing jumps to an item by its label.'
				}
			}
		}
	});

	const sides: MenuSide[] = ['bottom', 'top', 'left', 'right'];
	const aligns: MenuAlign[] = ['start', 'center', 'end'];

	const chosen = $state({ value: '' });
	const placement = $state<{ side: MenuSide; align: MenuAlign }>({ side: 'bottom', align: 'end' });

	/** The open menu, which is portalled to the end of the document. */
	const menu = () => document.querySelector<HTMLElement>('.og-menu');
	const items = () => [...document.querySelectorAll<HTMLElement>('.og-menu-item')];
	const highlighted = () => document.querySelector<HTMLElement>('.og-menu-item[data-highlighted]');

	async function openMenu(trigger: HTMLElement) {
		await userEvent.click(trigger);
		await waitFor(() => expect(menu()).not.toBeNull());
		// The outer menu never fades or blurs (that would hide the surface's backdrop blur
		// in WebKit until the entrance ends); the surface does.
		await expect(getComputedStyle(menu()!).opacity).toBe('1');
		await expect(getComputedStyle(menu()!).filter).toBe('none');
		await waitFor(() =>
			expect(getComputedStyle(menu()!.querySelector('.og-menu-surface')!).opacity).toBe('1')
		);
	}

	async function closeMenu() {
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(menu()).toBeNull());
	}

	const round = (n: number) => Math.round(n);
</script>

{#snippet actions(onSelect: (label: string) => void = () => {})}
	<MenuItem icon={Pencil} label="This is an action" onSelect={() => onSelect('action')} />
	<MenuItem icon={Copy} label="A secondary action" onSelect={() => onSelect('secondary')} />
	<MenuItem icon={Share} label="A third thing" onSelect={() => onSelect('third')} />
	<MenuItem
		icon={Trash2}
		label="Something dangerous"
		colorway="danger"
		onSelect={() => onSelect('dangerous')}
	/>
{/snippet}

{#snippet more({ props, open }: { props: Record<string, unknown>; open: boolean })}
	<IconButton {...props} active={open} icon={Ellipsis} label="More" tooltip={false} />
{/snippet}

<Story name="Playground" args={{ side: 'bottom', align: 'end' }}>
	{#snippet template(args)}
		<div class="centre">
			<Menu side={args.side} align={args.align} width={args.width} trigger={more}>
				{@render actions()}
			</Menu>
		</div>
	{/snippet}
</Story>

<!-- Menus.sketchframe: an icon button's menu, below it and right-aligned. -->
<Story
	name="Menu"
	asChild
	play={async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector<HTMLElement>('.og-button')!;
		await openMenu(trigger);

		// The trigger looks active while its menu is open.
		await expect(trigger.hasAttribute('data-og-active')).toBe(true);
		await expect(
			sameColor(getComputedStyle(trigger).backgroundColor, colors['dark-thin-glass'])
		).toBe(true);

		// 200px wide, 2px below the trigger, right edges lined up.
		const button = trigger.getBoundingClientRect();
		const box = menu()!.getBoundingClientRect();
		await expect(menu()!.dataset.side).toBe('bottom');
		await expect(box.width).toBe(200);
		await expect(round(box.top - button.bottom)).toBe(2);
		await expect(round(box.right)).toBe(round(button.right));

		// 4px padding around 30px row buttons, 2px apart: 134px tall.
		const [first, second, , danger] = items();
		await expect(round(box.height)).toBe(134);
		await expect(round(first.getBoundingClientRect().top - box.top)).toBe(4);
		await expect(round(first.getBoundingClientRect().left - box.left)).toBe(4);
		await expect(first.getBoundingClientRect().width).toBe(192);
		await expect(first.getBoundingClientRect().height).toBe(30);
		await expect(
			round(second.getBoundingClientRect().top - first.getBoundingClientRect().bottom)
		).toBe(2);

		// Row button contents: a 16px icon, then the label 30px in.
		await expect(first.querySelector('svg')!.getBoundingClientRect().width).toBe(16);
		const label = first.querySelector('.og-button-row-label')!.getBoundingClientRect();
		await expect(round(label.left - first.getBoundingClientRect().left)).toBe(30);
		await expect(sameColor(getComputedStyle(danger).color, colors.danger)).toBe(true);

		// Acrylic (Elevated): translucent white, a 10px backdrop blur, the elevated shadow.
		const surface = menu()!.querySelector<HTMLElement>('.og-menu-surface')!;
		await expect(getComputedStyle(surface).backgroundColor).toBe('rgba(255, 255, 255, 0.7)');
		await expect(getComputedStyle(surface).backdropFilter).toBe('blur(10px)');
		await expect(getComputedStyle(menu()!).boxShadow).toContain('9px 20px');

		// The highlighted item takes its colourway's thin glass layer.
		await userEvent.hover(first);
		await waitFor(() => expect(highlighted()).toBe(first));
		const layer = getComputedStyle(first, '::before');
		await expect(sameColor(layer.backgroundColor, colors['dark-thin-glass'])).toBe(true);
		await expect(layer.opacity).toBe('1');
		await userEvent.hover(danger);
		await waitFor(() => expect(highlighted()).toBe(danger));
		const dangerLayer = getComputedStyle(danger, '::before');
		await expect(sameColor(dangerLayer.backgroundColor, colors['danger-thin-glass'])).toBe(true);
		await expect(dangerLayer.opacity).toBe('1');
		await waitFor(() => expect(getComputedStyle(first, '::before').opacity).toBe('0'));

		// Grows from the trigger's corner (top right) over 100ms.
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const motion = getComputedStyle(menu()!);
		// Scale and shadow on the menu; fade and blur on its surface.
		await expect(motion.transitionProperty).toBe('scale, box-shadow');
		await expect(motion.transitionDuration).toBe(reduced ? '0s, 0s' : '0.1s, 0.1s');
		const surfaceMotion = getComputedStyle(menu()!.querySelector('.og-menu-surface')!);
		await expect(surfaceMotion.transitionProperty).toBe('opacity, filter');
		await expect(surfaceMotion.transitionDuration).toBe(reduced ? '0s, 0s' : '0.1s, 0.1s');
		await expect(motion.transformOrigin).toBe(`${box.width}px 0px`);

		// Choosing an item runs it and closes the menu.
		await userEvent.click(items()[1]);
		await waitFor(() => expect(menu()).toBeNull());
		await expect(canvasElement.querySelector('[data-testid="chosen"]')!.textContent).toBe(
			'secondary'
		);
		await expect(trigger.hasAttribute('data-og-active')).toBe(false);
		chosen.value = '';
	}}
>
	<div class="stage">
		<Menu trigger={more}>
			{@render actions((value) => (chosen.value = value))}
		</Menu>
		<Text variant="caption" as="p" data-testid="chosen">{chosen.value}</Text>
	</div>
</Story>

<!-- Every side and alignment. The trigger moves so each menu has room. -->
<Story
	name="Placements"
	asChild
	play={async ({ canvasElement }) => {
		for (const side of sides) {
			for (const align of aligns) {
				placement.side = side;
				placement.align = align;
				await waitFor(() =>
					expect(canvasElement.querySelector(`[data-placement="${side}-${align}"]`)).not.toBeNull()
				);
				const trigger = canvasElement.querySelector<HTMLElement>('.target .og-button')!;
				await openMenu(trigger);
				const t = trigger.getBoundingClientRect();
				const m = menu()!.getBoundingClientRect();
				await expect(menu()!.dataset.side).toBe(side);
				await expect(menu()!.dataset.align).toBe(align);

				// 2px from the trigger on the chosen side.
				const gap = {
					bottom: m.top - t.bottom,
					top: t.top - m.bottom,
					right: m.left - t.right,
					left: t.left - m.right
				}[side];
				await expect(round(gap)).toBe(2);

				// Lined up along that side.
				const vertical = side === 'top' || side === 'bottom';
				const [start, end, size] = vertical
					? (['left', 'right', 'width'] as const)
					: (['top', 'bottom', 'height'] as const);
				if (align === 'start') await expect(round(m[start])).toBe(round(t[start]));
				if (align === 'end') await expect(round(m[end])).toBe(round(t[end]));
				if (align === 'center') {
					await expect(round(m[start] + m[size] / 2)).toBe(round(t[start] + t[size] / 2));
				}
				await closeMenu();
			}
		}
		placement.side = 'bottom';
		placement.align = 'end';
	}}
>
	<div
		class="placements"
		data-side={placement.side}
		data-placement="{placement.side}-{placement.align}"
	>
		<div class="pickers">
			{#each sides as side (side)}
				<div class="picker">
					<Text variant="caption" as="span">{side}</Text>
					{#each aligns as align (align)}
						<Button
							active={placement.side === side && placement.align === align}
							onclick={() => Object.assign(placement, { side, align })}
						>
							{align}
						</Button>
					{/each}
				</div>
			{/each}
		</div>
		<div class="target">
			<Menu side={placement.side} align={placement.align} trigger={more}>
				{@render actions()}
			</Menu>
		</div>
	</div>
</Story>

<!-- Near the viewport's edges, the menu flips and shifts to stay entirely in view. -->
<Story
	name="Collisions"
	asChild
	play={async ({ canvasElement }) => {
		const inView = (r: DOMRect) =>
			r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;

		const cases: [string, string][] = [
			// Asked for above, but it's at the top: opens below, shifted right to fit.
			['top-left', 'bottom'],
			// Opens below by default, but it's at the bottom: opens above.
			['bottom-right', 'top'],
			// Asked for the left, but it's at the left edge: opens to the right.
			['middle-left', 'right']
		];
		for (const [corner, side] of cases) {
			const trigger = canvasElement.querySelector<HTMLElement>(
				`[data-corner="${corner}"] .og-button`
			)!;
			await openMenu(trigger);
			await expect(menu()!.dataset.side).toBe(side);
			const box = menu()!.getBoundingClientRect();
			await expect(inView(box)).toBe(true);
			await expect(round(box.width)).toBe(200);
			await closeMenu();
		}
	}}
>
	<div class="corner" data-corner="top-left">
		<Menu side="top" trigger={more}>{@render actions()}</Menu>
	</div>
	<div class="corner" data-corner="bottom-right">
		<Menu trigger={more}>{@render actions()}</Menu>
	</div>
	<div class="corner" data-corner="middle-left">
		<Menu side="left" trigger={more}>{@render actions()}</Menu>
	</div>
	<div class="centre">
		<Text variant="caption" as="p">
			These triggers sit at the edges of the viewport, so their menus move to stay in view.
		</Text>
	</div>
</Story>

<Story
	name="Keyboard"
	asChild
	play={async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector<HTMLElement>('.og-button')!;
		trigger.focus();

		// Enter opens the menu with the first item highlighted.
		await userEvent.keyboard('{Enter}');
		await waitFor(() => expect(menu()).not.toBeNull());
		const all = items();
		await waitFor(() => expect(highlighted()).toBe(all[0]));
		const layer = getComputedStyle(all[0], '::before');
		await expect(layer.opacity).toBe('1');
		// The highlight is the indicator: no focus ring on items.
		const ring = all[0].parentElement!.querySelector<HTMLElement>('.og-focus-ring');
		await expect(ring === null || getComputedStyle(ring).display === 'none').toBe(true);

		// Arrows move through the items and wrap around.
		await userEvent.keyboard('{ArrowDown}');
		await expect(highlighted()).toBe(all[1]);
		await userEvent.keyboard('{ArrowUp}{ArrowUp}');
		await expect(highlighted()).toBe(all[3]);
		await userEvent.keyboard('{Home}');
		await expect(highlighted()).toBe(all[0]);

		// Typing jumps to the next item starting with those letters; repeating a
		// letter cycles through its items.
		await userEvent.keyboard('a');
		await waitFor(() => expect(highlighted()).toBe(all[1]));
		await userEvent.keyboard('a');
		await waitFor(() => expect(highlighted()).toBe(all[2]));
		await new Promise((resolve) => setTimeout(resolve, 1100));
		await userEvent.keyboard('s');
		await waitFor(() => expect(highlighted()).toBe(all[3]));

		// Escape closes the menu and returns focus to the trigger.
		await closeMenu();
		await expect(document.activeElement).toBe(trigger);

		// Enter on an item chooses it.
		await userEvent.keyboard('{ArrowDown}');
		await waitFor(() => expect(highlighted()).toBe(items()[0]));
		await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
		await waitFor(() => expect(menu()).toBeNull());
		await expect(canvasElement.querySelector('[data-testid="chosen"]')!.textContent).toBe('third');
		await expect(document.activeElement).toBe(trigger);
		chosen.value = '';
	}}
>
	<div class="stage">
		<Menu trigger={more}>
			{@render actions((value) => (chosen.value = value))}
		</Menu>
		<Text variant="caption" as="p" data-testid="chosen">{chosen.value}</Text>
	</div>
</Story>

<!-- Any button can open a menu. Items can carry a secondary label or icon, be links,
     or be disabled. -->
<Story
	name="Item options"
	asChild
	play={async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector<HTMLElement>('.og-button')!;
		await openMenu(trigger);
		await expect(menu()!.dataset.align).toBe('start');
		const [move, , archive, link] = items();

		await expect(move.querySelector('.og-subtitle')!.textContent).toBe('⌘M');
		await expect(archive.hasAttribute('disabled')).toBe(true);
		await expect(sameColor(getComputedStyle(archive).color, colors['dark-secondary'])).toBe(true);
		await expect(link.tagName).toBe('A');
		await expect(link.getAttribute('href')).toBe('#help');

		// Disabled items are skipped by the arrow keys.
		await userEvent.keyboard('{ArrowDown}');
		await waitFor(() => expect(highlighted()).toBe(move));
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await expect(highlighted()).toBe(link);
		await closeMenu();
	}}
>
	<div class="stage">
		<Menu align="start">
			{#snippet trigger({ props, open })}
				<Button {...props} active={open} icon={Star}>Options</Button>
			{/snippet}
			<MenuItem icon={FolderInput} label="Move to…" secondaryLabel="⌘M" />
			<MenuItem icon={Copy} label="Duplicate" secondaryLabel="⌘D" />
			<MenuItem icon={Archive} label="Archive" disabled />
			<MenuItem icon={ExternalLink} label="Help" href="#help" secondaryIcon={ExternalLink} />
		</Menu>
	</div>
</Story>

<!-- Menus.md: no more than 6 controls. In development, a longer menu warns. -->
<Story
	name="Too many items"
	asChild
	play={async ({ canvasElement }) => {
		const warn = spyOn(console, 'warn').mockImplementation(() => {});
		try {
			await openMenu(canvasElement.querySelector<HTMLElement>('.og-button')!);
			await waitFor(() =>
				expect(warn).toHaveBeenCalledWith(expect.stringContaining('no more than 6 controls'))
			);
			await closeMenu();
		} finally {
			warn.mockRestore();
		}
	}}
>
	<div class="stage">
		<Menu trigger={more}>
			{@render actions()}
			<MenuItem icon={FolderInput} label="Move to…" />
			<MenuItem icon={Archive} label="Archive" />
			<MenuItem icon={Star} label="Favourite" />
		</Menu>
	</div>
</Story>

<style>
	.stage {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		width: 240px;
		margin: 24px;
	}
	.centre {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 320px;
	}
	.placements {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.pickers {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
	}
	.picker {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	/* The trigger sits where its menu has room: centred above and below, at the
	   far edge for the left and right sides. */
	.target {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 360px;
	}
	.placements[data-side='left'] .target {
		justify-content: flex-end;
	}
	.placements[data-side='right'] .target {
		justify-content: flex-start;
	}
	.corner {
		position: fixed;
	}
	[data-corner='top-left'] {
		top: 4px;
		left: 4px;
	}
	[data-corner='bottom-right'] {
		right: 4px;
		bottom: 4px;
	}
	[data-corner='middle-left'] {
		top: 50%;
		left: 4px;
	}
</style>
