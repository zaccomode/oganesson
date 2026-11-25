<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, waitFor } from 'storybook/test';
	import { Component as Placeholder } from '@lucide/svelte';
	import { IconButton, ScrollEdgeEffect, Text, Toolbar, ToolbarGroup, TooltipProvider } from '#lib';

	const { Story } = defineMeta({
		title: 'Toolbars/Scroll Edge Effect',
		component: ScrollEdgeEffect,
		tags: ['autodocs'],
		argTypes: {
			edge: { control: 'inline-radio', options: ['top', 'bottom'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Elevates toolbars over scrolling content (Scroll Edge Effect.md): a progressive blur, strongest at the edge, under a gradient into Background 1. It’s a full-width bar pinned to the `top` or `bottom` of its scroll container, laying out its children in a row 8px apart with 16px padding. Use it only under a toolbar; plain overflow should scroll cleanly.'
				}
			}
		}
	});

	const passage = [
		'Lorem ipsum dolor sit amet consectetur. Voluptas fuga deserunt reprehenderit quod occaecat exercitation. Expedita imperdiet eligendi assumenda consequat qui est vero. Excepteur dolores dolor dignissimos sit et ullamco duis optio laborum est eligendi.',
		'Tempore dolore libero dolore dolore laboris cupiditate nobis in ad. Ut provident pariatur quis nisi cumque aute et autem laborum soluta nam. Sit animi tempor sunt tempor blanditiis. Est animi cillum provident in excepteur. Dolor iusto deleniti ducimus et dolor elit officia omnis.',
		'Occaecat do eiusmod est ad exercitation ut velit distinctio. Omnis id eum maxime dolore voluptatum minus voluptatum. Irure accusamus aut cupidatat et aliqua corrupti pariatur libero molestias deserunt ducimus commodo.',
		'Ut sit temporibus esse do nam est pariatur et. Omnis repellendus proident corrupti assumenda ut veniam sunt. Amet quis excepturi libero est quibusdam qui consequatur. Quo sunt fugiat est nihil quis expedita voluptas. Ipsum culpa laborum ut cillum.'
	];

	const rect = (el: Element) => el.getBoundingClientRect();
	const round = (n: number) => Math.round(n);
</script>

{#snippet content()}
	{#each [0, 1] as round (round)}
		{#each passage as paragraph, i (i)}
			<p class="og-label">{paragraph}</p>
		{/each}
	{/each}
{/snippet}

{#snippet bottomToolbar()}
	<Toolbar aria-label="Actions">
		<ToolbarGroup>
			<IconButton icon={Placeholder} label="First" />
			<IconButton icon={Placeholder} label="Second" />
			<IconButton icon={Placeholder} label="Third" />
			<IconButton icon={Placeholder} label="Fourth" />
			<IconButton icon={Placeholder} label="Fifth" />
		</ToolbarGroup>
	</Toolbar>
{/snippet}

<Story name="Playground" args={{ edge: 'bottom' }}>
	{#snippet template(args)}
		<TooltipProvider>
			<!-- Focusable so keyboard users can scroll it (axe: scrollable-region-focusable). -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div class="scroller" tabindex="0" role="region" aria-label="Passage">
				{#if args.edge === 'top'}
					<ScrollEdgeEffect edge="top">{@render bottomToolbar()}</ScrollEdgeEffect>
				{/if}
				<div class="passage">{@render content()}</div>
				{#if args.edge !== 'top'}
					<ScrollEdgeEffect edge="bottom">{@render bottomToolbar()}</ScrollEdgeEffect>
				{/if}
			</div>
		</TooltipProvider>
	{/snippet}
</Story>

<!-- Scroll Edge Effect.sketchframe: a passage scrolling under a title bar at the
     top and an action toolbar at the bottom. -->
<Story
	name="Scroll Edge Effect"
	asChild
	play={async ({ canvasElement }) => {
		const scroller = canvasElement.querySelector<HTMLElement>('.scroller')!;
		const [top, bottom] = canvasElement.querySelectorAll<HTMLElement>('.og-scroll-edge');
		await expect(top.dataset.edge).toBe('top');
		await expect(bottom.dataset.edge).toBe('bottom');

		// Full width, 66px tall: a 34px toolbar in 16px padding.
		await expect(round(rect(top).width)).toBe(500);
		await expect(round(rect(top).height)).toBe(66);
		await expect(round(rect(bottom).height)).toBe(66);

		// Top: toolbar, title filling the row, toolbar, 8px apart from 16px in.
		const [back, actions] = top.querySelectorAll<HTMLElement>('.og-toolbar');
		const title = top.querySelector<HTMLElement>('.title')!;
		await expect(round(rect(back).left - rect(top).left)).toBe(16);
		await expect(round(rect(back).top - rect(top).top)).toBe(16);
		await expect(round(rect(title).left - rect(back).right)).toBe(8);
		await expect(round(rect(actions).left - rect(title).right)).toBe(8);
		await expect(round(rect(top).right - rect(actions).right)).toBe(16);

		// Bottom: one toolbar, centred.
		const toolbar = bottom.querySelector<HTMLElement>('.og-toolbar')!;
		await expect(round(rect(toolbar).width)).toBe(162);
		await expect(round(rect(toolbar).left - rect(bottom).left)).toBe(169);

		// Pinned: both stay at their edges while the content scrolls beneath.
		const box = rect(scroller);
		await expect(round(rect(top).top)).toBe(round(box.top));
		await expect(round(rect(bottom).bottom)).toBe(round(box.bottom));
		scroller.scrollTop = 300;
		await waitFor(() => expect(round(rect(top).top)).toBe(round(box.top)));
		await expect(round(rect(bottom).bottom)).toBe(round(box.bottom));
		const behind = document.elementFromPoint(box.left + 260, box.top + 8);
		await expect(behind?.closest('.passage')).not.toBeNull();

		// The progressive blur: four bands doubling up to 4px, on elements that are
		// siblings of the toolbars, so nothing above the toolbars' acrylic isolates it.
		const bands = [...bottom.querySelectorAll<HTMLElement>('.og-scroll-edge-blur')];
		await expect(bands.map((b) => getComputedStyle(b).backdropFilter)).toEqual([
			'blur(0.5px)',
			'blur(1px)',
			'blur(2px)',
			'blur(4px)'
		]);
		await expect(getComputedStyle(bands[3]).maskImage).toContain('linear-gradient');
		for (const el of [bottom, toolbar, toolbar.querySelector('.og-toolbar-group')!]) {
			const style = getComputedStyle(el);
			await expect(style.opacity).toBe('1');
			await expect(style.filter).toBe('none');
			await expect(style.maskImage).toBe('none');
			await expect(style.backdropFilter).toBe('none');
		}

		// The gradient: Background 1 at 70% at the edge, clear at the content side.
		const backdrop = bottom.querySelector('.og-scroll-edge-backdrop')!;
		const gradient = getComputedStyle(backdrop, '::after').backgroundImage;
		await expect(gradient).toContain('rgba(245, 247, 247, 0)');
		await expect(gradient).toContain('rgba(242, 244, 244, 0.7');
	}}
>
	<TooltipProvider>
		<!-- Focusable so keyboard users can scroll it (axe: scrollable-region-focusable). -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class="scroller" tabindex="0" role="region" aria-label="Passage">
			<ScrollEdgeEffect edge="top">
				<Toolbar aria-label="Navigation">
					<ToolbarGroup>
						<IconButton icon={Placeholder} label="Back" />
					</ToolbarGroup>
				</Toolbar>
				<Text variant="title" class="title">Example Passage</Text>
				<Toolbar aria-label="Passage">
					<ToolbarGroup>
						<IconButton icon={Placeholder} label="First" />
						<IconButton icon={Placeholder} label="Second" />
						<IconButton icon={Placeholder} label="Third" />
					</ToolbarGroup>
				</Toolbar>
			</ScrollEdgeEffect>
			<div class="passage">{@render content()}</div>
			<ScrollEdgeEffect edge="bottom">{@render bottomToolbar()}</ScrollEdgeEffect>
		</div>
	</TooltipProvider>
</Story>

<!-- Without a toolbar, overflow scrolls cleanly: no effect. -->
<Story
	name="Plain overflow"
	asChild
	play={async ({ canvasElement }) => {
		await expect(canvasElement.querySelector('.og-scroll-edge')).toBeNull();
	}}
>
	<!-- Focusable so keyboard users can scroll it (axe: scrollable-region-focusable). -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="scroller" tabindex="0" role="region" aria-label="Passage">
		<div class="passage">{@render content()}</div>
	</div>
</Story>

<style>
	/* Scroll Edge Effect.sketchframe: a 500×400 frame on Background 1 with 12px corners. */
	.scroller {
		width: 500px;
		height: 400px;
		overflow: auto;
		background: var(--og-bg-1);
		border-radius: 12px;
	}

	.passage {
		padding: 0 24px;
	}

	.passage p {
		margin: 0 0 18px;
	}

	.scroller :global(.title) {
		flex: 1;
		margin: 0;
		min-width: 0;
	}
</style>
