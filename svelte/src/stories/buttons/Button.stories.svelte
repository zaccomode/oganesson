<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent } from 'storybook/test';
	import { ArrowRight, Plus, Trash2 } from '@lucide/svelte';
	import { Button, Text } from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Buttons/Button',
		component: Button,
		tags: ['autodocs'],
		args: { onclick: fn() },
		argTypes: {
			appearance: { control: 'inline-radio', options: ['subtle', 'prominent'] },
			colorway: { control: 'inline-radio', options: ['dark', 'primary', 'danger'] },
			iconPosition: { control: 'inline-radio', options: ['left', 'right'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'A label with an optional icon on either side (Buttons.md). **Subtle** buttons (dark, primary, danger) are for most actions; use one **prominent** button for the recommended next action. `active` marks the current item; `elevated` gives a prominent button its shadow at rest. Pass `href` for a link.'
				}
			}
		}
	});

	const colorways = ['dark', 'primary', 'danger'] as const;
</script>

<Story name="Playground" args={{ appearance: 'subtle', colorway: 'dark' }}>
	{#snippet template(args)}
		<Button
			appearance={args.appearance}
			colorway={args.colorway}
			active={args.active}
			elevated={args.elevated}
			disabled={args.disabled}
			iconPosition={args.iconPosition}
			onclick={args.onclick}
			icon={Plus}
		>
			Oganesson
		</Button>
	{/snippet}
</Story>

<Story
	name="Subtle"
	asChild
	play={async ({ canvasElement }) => {
		const buttons = canvasElement.querySelectorAll<HTMLElement>('.og-button');
		for (const b of buttons) await expect(b.getBoundingClientRect().height).toBe(30);
		// Labels can't be selected.
		for (const b of buttons) await expect(getComputedStyle(b).userSelect).toBe('none');

		const plain = canvasElement.querySelector<HTMLElement>('[data-case="dark-none"] .og-button')!;
		await expect(getComputedStyle(plain).padding).toBe('6px 10px');
		await expect(getComputedStyle(plain).color).toBe('rgb(33, 37, 43)');

		const left = canvasElement.querySelector<HTMLElement>('[data-case="dark-left"] .og-button')!;
		await expect(getComputedStyle(left).paddingLeft).toBe('8px');
		await expect(left.querySelector('svg')!.getBoundingClientRect().width).toBe(16);

		const active = canvasElement.querySelector<HTMLElement>(
			'[data-case="primary-none-active"] .og-button'
		)!;
		await expect(
			sameColor(getComputedStyle(active).backgroundColor, colors['primary-thin-glass'])
		).toBe(true);
		await expect(getComputedStyle(active).color).toBe('rgb(81, 85, 239)');

		const danger = canvasElement.querySelector<HTMLElement>(
			'[data-case="danger-none"] .og-button'
		)!;
		await expect(
			sameColor(getComputedStyle(danger, '::before').backgroundColor, colors['danger-thin-glass'])
		).toBe(true);
	}}
>
	<div class="grid">
		{#each [undefined, 'left', 'right'] as const as position (position)}
			{#each colorways as colorway (colorway)}
				{#each [false, true] as active (active)}
					<div data-case="{colorway}-{position ?? 'none'}{active ? '-active' : ''}">
						<Button {colorway} {active} icon={position ? Plus : undefined} iconPosition={position}>
							Oganesson
						</Button>
					</div>
				{/each}
			{/each}
		{/each}
	</div>
</Story>

<Story
	name="Prominent"
	play={async ({ canvasElement, args }) => {
		const button = canvasElement.querySelector<HTMLElement>('[data-case="plain"] .og-button')!;
		await expect(getComputedStyle(button).backgroundImage).toMatch(
			/linear-gradient\(rgb\(63, 67, 74\) 0%, rgb\(9, 10, 12\) 100%\)/
		);
		await expect(getComputedStyle(button).color).toBe('rgb(255, 255, 255)');

		const shell = (c: string) =>
			canvasElement.querySelector<HTMLElement>(`[data-case="${c}"] .og-button-shell`)!;
		await expect(getComputedStyle(shell('plain'), '::before').opacity).toBe('0');
		await expect(getComputedStyle(shell('elevated'), '::before').opacity).toBe('1');
		await expect(getComputedStyle(shell('disabled')).opacity).toBe('0.5');
		// At rest there's no hover strip below the button: hovering just under it would
		// raise the button away from the pointer and make it bounce.
		await expect(getComputedStyle(shell('plain'), '::after').content).toBe('none');

		await userEvent.click(button);
		await expect(args.onclick).toHaveBeenCalledOnce();
	}}
>
	{#snippet template(args)}
		<div class="column">
			<div class="row" data-case="plain">
				<Button appearance="prominent" onclick={args.onclick}>Oganesson</Button>
				<Text variant="caption" as="span">default</Text>
			</div>
			<div class="row" data-case="elevated">
				<Button appearance="prominent" elevated icon={Plus}>Oganesson</Button>
				<Text variant="caption" as="span">elevated · icon left</Text>
			</div>
			<div class="row">
				<Button appearance="prominent" icon={ArrowRight} iconPosition="right">Oganesson</Button>
				<Text variant="caption" as="span">icon right</Text>
			</div>
			<div class="row" data-case="disabled">
				<Button appearance="prominent" disabled>Oganesson</Button>
				<Text variant="caption" as="span">disabled</Text>
			</div>
		</div>
	{/snippet}
</Story>

<Story
	name="Disabled"
	play={async ({ canvasElement, args }) => {
		const button = canvasElement.querySelector<HTMLButtonElement>('[data-case="dark"] button')!;
		await expect(button.disabled).toBe(true);
		await expect(sameColor(getComputedStyle(button).color, colors['dark-secondary'])).toBe(true);
		await userEvent.click(button, { pointerEventsCheck: 0 });
		await expect(args.onclick).not.toHaveBeenCalled();

		const link = canvasElement.querySelector<HTMLAnchorElement>('[data-case="link"] a')!;
		await expect(link.hasAttribute('href')).toBe(false);
		await expect(link.getAttribute('aria-disabled')).toBe('true');
	}}
>
	{#snippet template(args)}
		<div class="row">
			{#each colorways as colorway (colorway)}
				<span data-case={colorway}>
					<Button {colorway} disabled icon={Trash2} onclick={args.onclick}>Oganesson</Button>
				</span>
			{/each}
			<span data-case="link"><Button href="/somewhere" disabled>Link</Button></span>
		</div>
	{/snippet}
</Story>

<Story
	name="Focus"
	asChild
	play={async ({ canvasElement }) => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const expected = {
			dark: ['dark-thick-glass', 'dark-secondary'],
			primary: ['primary-thick-glass', 'primary-secondary'],
			danger: ['danger-thick-glass', 'danger-secondary'],
			prominent: ['dark-thick-glass', 'dark-secondary']
		} as const;

		(document.activeElement as HTMLElement | null)?.blur();
		for (const [name, [outer, inner]] of Object.entries(expected)) {
			const frame = canvasElement.querySelector(`[data-case="${name}"] .og-button-frame`)!;
			const ring = frame.querySelector<SVGElement>('.og-focus-ring')!;

			// Keyboard focus shows the indicator instantly, in the colorway's colours.
			await userEvent.tab();
			await expect(document.activeElement).toBe(frame.querySelector('.og-button'));
			await expect(getComputedStyle(ring).transitionDuration).toBe('0s');
			await expect(getComputedStyle(ring).opacity).toBe('1');
			const stroke = (part: string) =>
				getComputedStyle(ring.querySelector(`.og-focus-ring-${part}`)!).stroke;
			await expect(sameColor(stroke('outer'), colors[outer])).toBe(true);
			await expect(sameColor(stroke('inner'), colors[inner])).toBe(true);
		}

		// Leaving focus fades it out slowly.
		(document.activeElement as HTMLElement).blur();
		const last = canvasElement.querySelector<SVGElement>('[data-case="prominent"] .og-focus-ring')!;
		await expect(getComputedStyle(last).transitionDuration).toBe(reduced ? '0s' : '0.5s');
	}}
>
	<div class="column">
		<Text variant="small-label">
			Press Tab to move through the buttons (Option-Tab in Safari). The indicator takes the button's
			colorway, appears instantly and fades out over 500ms.
		</Text>
		<div class="row">
			{#each colorways as colorway (colorway)}
				<div data-case={colorway}><Button {colorway}>Oganesson</Button></div>
			{/each}
			<div data-case="prominent"><Button appearance="prominent">Oganesson</Button></div>
		</div>
	</div>
</Story>

<Story
	name="Link"
	asChild
	play={async ({ canvasElement }) => {
		const link = canvasElement.querySelector<HTMLAnchorElement>('a.og-button')!;
		await expect(link.getAttribute('href')).toBe('#settings');
		await expect(getComputedStyle(link).textDecorationLine).toBe('none');
	}}
>
	<Button href="#settings" icon={ArrowRight} iconPosition="right">Settings</Button>
</Story>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(6, max-content);
		gap: 20px 24px;
		align-items: center;
	}
	.column {
		display: grid;
		gap: 20px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 16px;
	}
</style>
