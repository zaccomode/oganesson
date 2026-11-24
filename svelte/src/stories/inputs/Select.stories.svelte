<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, waitFor } from 'storybook/test';
	import { Globe, Shapes } from '@lucide/svelte';
	import { Select, Text, type SelectOption } from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Inputs/Select',
		component: Select,
		tags: ['autodocs'],
		argTypes: {
			appearance: { control: 'inline-radio', options: ['default', 'subtle'] },
			side: { control: 'inline-radio', options: ['bottom', 'top'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Pick one value from a fixed list (Inputs.md). Shares the text input’s **default** and **subtle** styles, left icon and placeholder. The menu opens below (or above) and flips when there isn’t `minHeight` (140px) of room; it shows up to `maxItems` (5) options, or `maxHeight` pixels, then scrolls. Set `typeahead` to filter options by typing.'
				}
			}
		}
	});

	const options: SelectOption[] = [
		{ value: 'first', label: 'First option' },
		{ value: 'second', label: 'Second option' },
		{ value: 'third', label: 'Third option' },
		{ value: 'fourth', label: 'Fourth option' }
	];

	const countries: SelectOption[] = [
		'Argentina',
		'Australia',
		'Austria',
		'Belgium',
		'Brazil',
		'Canada',
		'Chile',
		'Denmark',
		'Finland',
		'France',
		'Germany',
		'Iceland',
		'India',
		'Ireland',
		'Italy',
		'Japan',
		'Mexico',
		'Netherlands',
		'New Zealand',
		'Norway',
		'Portugal',
		'Spain',
		'Sweden',
		'Switzerland'
	].map((label) => ({ value: label.toLowerCase().replace(/ /g, '-'), label }));

	const picked = $state({ value: 'second' });
	const country = $state({ value: '' });
	const keyboard = $state({ value: '' });
	const optional = $state({ value: 'second', country: 'sweden' });

	/** The open menu, which is portalled to the end of the document. */
	const menu = () => document.querySelector<HTMLElement>('.og-select-menu');
	const items = () => [...document.querySelectorAll<HTMLElement>('.og-select-item')];
	const closeMenu = async () => {
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(menu()).toBeNull());
	};
</script>

<Story name="Playground" args={{ appearance: 'default', placeholder: 'Select an option...' }}>
	{#snippet template(args)}
		<div class="field">
			<Select {...args} items={options} icon={Shapes} aria-label="Playground" />
		</div>
	{/snippet}
</Story>

<Story
	name="Styles"
	asChild
	play={async ({ canvasElement }) => {
		const field = (c: string) =>
			canvasElement.querySelector<HTMLElement>(`[data-case="${c}"] .og-select-field`)!;

		for (const c of ['default-icon', 'default', 'subtle-icon', 'subtle']) {
			await expect(field(c).getBoundingClientRect().height).toBe(28);
		}
		await expect(getComputedStyle(field('default-icon')).padding).toBe('6px 8px');
		await expect(getComputedStyle(field('default')).padding).toBe('6px 8px 6px 10px');
		await expect(
			sameColor(getComputedStyle(field('default')).backgroundColor, colors['dark-thin-glass'])
		).toBe(true);
		await expect(getComputedStyle(field('subtle')).backgroundColor).toBe('rgba(0, 0, 0, 0)');

		// Placeholder, icon and chevron in the secondary colour; 12px icons.
		const value = field('default-icon').querySelector('.og-select-value')!;
		await expect(sameColor(getComputedStyle(value).color, colors['dark-secondary'])).toBe(true);
		for (const part of ['.og-select-icon', '.og-select-chevron']) {
			const el = field('default-icon').querySelector<HTMLElement>(part)!;
			await expect(sameColor(getComputedStyle(el).color, colors['dark-secondary'])).toBe(true);
			await expect(el.querySelector('svg')!.getBoundingClientRect().width).toBe(12);
		}

		// A selected value is drawn in Dark.
		const chosen = field('selected').querySelector('.og-select-value')!;
		await expect(chosen.textContent?.trim()).toBe('Second option');
		await expect(getComputedStyle(chosen).color).toBe('rgb(33, 37, 43)');
	}}
>
	<div class="grid">
		<Text variant="caption" as="span"></Text>
		<Text variant="caption" as="span">Icon</Text>
		<Text variant="caption" as="span">No icon</Text>
		{#each ['default', 'subtle'] as const as appearance (appearance)}
			<Text variant="caption" as="span">{appearance}</Text>
			<div class="field" data-case="{appearance}-icon">
				<Select
					{appearance}
					items={options}
					icon={Shapes}
					placeholder="Select an option..."
					aria-label="{appearance} with icon"
				/>
			</div>
			<div class="field" data-case={appearance}>
				<Select
					{appearance}
					items={options}
					placeholder="Select an option..."
					aria-label={appearance}
				/>
			</div>
		{/each}
		<Text variant="caption" as="span">selected</Text>
		<div class="field" data-case="selected">
			<Select items={options} value="second" icon={Shapes} aria-label="Selected" />
		</div>
	</div>
</Story>

<Story
	name="Menu"
	asChild
	play={async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector<HTMLElement>('.og-select-field')!;
		await userEvent.click(trigger);
		await waitFor(() => expect(menu()).not.toBeNull());
		await waitFor(() => expect(getComputedStyle(menu()!).opacity).toBe('1'));

		// 2px below the field, at least as wide, 4px padding around 28px items 2px apart.
		const field = trigger.getBoundingClientRect();
		const box = menu()!.getBoundingClientRect();
		await expect(Math.round(box.top - field.bottom)).toBe(2);
		await expect(Math.round(box.left)).toBe(Math.round(field.left));
		await expect(box.width).toBeGreaterThanOrEqual(field.width);
		const [first, second] = items();
		await expect(first.getBoundingClientRect().height).toBe(28);
		await expect(Math.round(first.getBoundingClientRect().top - box.top)).toBe(4);
		await expect(
			Math.round(second.getBoundingClientRect().top - first.getBoundingClientRect().bottom)
		).toBe(2);
		await expect(Math.round(box.height)).toBe(4 + 4 * 28 + 3 * 2 + 4);

		// Acrylic (Elevated): translucent white with a 10px backdrop blur.
		const surface = menu()!.querySelector<HTMLElement>('.og-select-menu-surface')!;
		await expect(getComputedStyle(surface).backgroundColor).toBe('rgba(255, 255, 255, 0.7)');
		await expect(getComputedStyle(surface).backdropFilter).toBe('blur(10px)');

		// The selected option has a 12px check; labels line up either way (26px in).
		await expect(second.querySelector('.og-select-check svg')).not.toBeNull();
		await expect(first.querySelector('.og-select-check svg')).toBeNull();
		for (const item of [first, second]) {
			const label = item.querySelector('.og-select-item-label')!.getBoundingClientRect();
			await expect(Math.round(label.left - item.getBoundingClientRect().left)).toBe(26);
		}

		// The highlighted option gains a thin glass layer.
		await userEvent.hover(first);
		await waitFor(() => expect(first.hasAttribute('data-highlighted')).toBe(true));
		const layer = getComputedStyle(first, '::before');
		await expect(sameColor(layer.backgroundColor, colors['dark-thin-glass'])).toBe(true);
		await expect(layer.opacity).toBe('1');

		// Below the field, the menu grows from the middle of its top edge, over 100ms.
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const motion = getComputedStyle(menu()!);
		await expect(motion.transitionDuration).toBe(reduced ? '0s, 0s, 0s' : '0.1s, 0.1s, 0.1s');
		const size = menu()!.getBoundingClientRect();
		await expect(motion.transformOrigin).toBe(`${size.width / 2}px 0px`);

		// Choosing an option selects it and closes the menu.
		await userEvent.click(items()[2]);
		await waitFor(() => expect(menu()).toBeNull());
		await expect(canvasElement.querySelector('[data-testid="picked"]')!.textContent).toBe('third');
		await expect(trigger.textContent).toContain('Third option');
		picked.value = 'second';
	}}
>
	<div class="field stage">
		<Select bind:value={picked.value} items={options} icon={Shapes} aria-label="Option" />
		<Text variant="caption" as="p" data-testid="picked">{picked.value}</Text>
	</div>
</Story>

<Story
	name="Long list"
	asChild
	play={async ({ canvasElement }) => {
		const [plain, capped] = canvasElement.querySelectorAll<HTMLElement>('.og-select-field');

		// Five options, then it scrolls.
		await userEvent.click(plain);
		await waitFor(() => expect(menu()).not.toBeNull());
		await waitFor(() => expect(getComputedStyle(menu()!).opacity).toBe('1'));
		await waitFor(() => expect(Math.round(menu()!.getBoundingClientRect().height)).toBe(156));
		const top = () => menu()!.querySelector('[data-edge="top"]')!;
		const bottom = () => menu()!.querySelector('[data-edge="bottom"]')!;
		const scrollbar = () => menu()!.querySelector<HTMLElement>('.og-select-scrollbar');
		await waitFor(() => expect(scrollbar()).not.toBeNull());
		await expect(scrollbar()!.getBoundingClientRect().width).toBe(2);
		await expect(bottom().hasAttribute('data-shown')).toBe(true);
		await expect(top().hasAttribute('data-shown')).toBe(false);

		// The list leaves room for the scrollbar.
		const list = menu()!.querySelector<HTMLElement>('.og-select-list')!;
		await expect(getComputedStyle(list).paddingRight).toBe('8px');

		// Scrolled to the end, the indicators swap.
		const viewport = menu()!.querySelector<HTMLElement>('.og-select-viewport')!;
		viewport.scrollTop = viewport.scrollHeight;
		await waitFor(() => expect(top().hasAttribute('data-shown')).toBe(true));
		await expect(bottom().hasAttribute('data-shown')).toBe(false);
		await closeMenu();

		// maxItems caps the menu at that many options.
		await userEvent.click(capped);
		await waitFor(() => expect(menu()).not.toBeNull());
		await waitFor(() => expect(Math.round(menu()!.getBoundingClientRect().height)).toBe(96));
		await closeMenu();
	}}
>
	<div class="row">
		<div class="field">
			<Select
				items={countries}
				icon={Globe}
				placeholder="Choose a country..."
				aria-label="Country"
			/>
		</div>
		<div class="field">
			<Select
				items={countries}
				maxItems={3}
				placeholder="Three at a time..."
				aria-label="Country, three at a time"
			/>
		</div>
	</div>
</Story>

<Story
	name="Flipping"
	asChild
	play={async ({ canvasElement }) => {
		// Too close to the bottom of the viewport for 140px, so the menu opens above.
		const trigger = canvasElement.querySelector<HTMLElement>('[data-case="low"] .og-select-field')!;
		await userEvent.click(trigger);
		await waitFor(() => expect(menu()).not.toBeNull());
		await waitFor(() =>
			expect(
				Math.round(trigger.getBoundingClientRect().top - menu()!.getBoundingClientRect().bottom)
			).toBe(2)
		);

		await waitFor(() => expect(getComputedStyle(menu()!).opacity).toBe('1'));
		// Above the field, it grows from the middle of its bottom edge.
		const size = menu()!.getBoundingClientRect();
		await expect(getComputedStyle(menu()!).transformOrigin).toBe(
			`${size.width / 2}px ${size.height}px`
		);
		await closeMenu();
	}}
>
	<div class="flip">
		<Text variant="small-label">
			This select sits at the bottom of the viewport, so its menu flips to open above it.
		</Text>
		<div class="field" data-case="low">
			<Select items={countries} placeholder="Opens upwards..." aria-label="Low select" />
		</div>
	</div>
</Story>

<Story
	name="Typeahead"
	asChild
	play={async ({ canvasElement }) => {
		const input = canvasElement.querySelector<HTMLInputElement>('input.og-select-input')!;
		const field = canvasElement.querySelector<HTMLElement>('.og-select-field')!;
		await expect(getComputedStyle(field, '::after').backgroundColor).toBe('rgba(0, 0, 0, 0)');

		// Clicking opens the menu; typing filters it.
		await userEvent.click(input);
		await waitFor(() => expect(menu()).not.toBeNull());
		await expect(items().length).toBe(countries.length);
		await waitFor(() => expect(getComputedStyle(menu()!).opacity).toBe('1'));
		// The menu lines up with the whole field, not just the text inside it.
		await expect(Math.round(menu()!.getBoundingClientRect().left)).toBe(
			Math.round(field.getBoundingClientRect().left)
		);
		await expect(menu()!.getBoundingClientRect().width).toBeGreaterThanOrEqual(
			field.getBoundingClientRect().width
		);
		await expect(Math.round(menu()!.getBoundingClientRect().height)).toBe(156);
		await userEvent.type(input, 'land');
		await waitFor(() =>
			expect(items().map((item) => item.textContent?.trim())).toEqual([
				'Finland',
				'Iceland',
				'Ireland',
				'Netherlands',
				'New Zealand',
				'Switzerland'
			])
		);

		// Filtering highlights the first match; arrow down and Enter choose the next
		// one, and the field shows its label.
		await waitFor(() => expect(items()[0].hasAttribute('data-highlighted')).toBe(true));
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await waitFor(() => expect(menu()).toBeNull());
		await expect(country.value).toBe('iceland');
		await expect(input.value).toBe('Iceland');

		// No matches shows the empty text.
		await userEvent.clear(input);
		await userEvent.type(input, 'zzz');
		await waitFor(() => expect(document.querySelector('.og-select-empty')).not.toBeNull());
		await expect(document.querySelector('.og-select-empty')!.textContent).toBe('No countries');
		await closeMenu();
		// Closing without choosing puts the selection back in the field.
		await expect(input.value).toBe('Iceland');
		input.blur();
		country.value = '';
		await waitFor(() => expect(input.value).toBe(''));
	}}
>
	<div class="field stage">
		<Select
			typeahead
			bind:value={country.value}
			items={countries}
			icon={Globe}
			placeholder="Search countries..."
			emptyText="No countries"
			aria-label="Country"
		/>
	</div>
</Story>

<Story
	name="Keyboard"
	asChild
	play={async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector<HTMLElement>('.og-select-field')!;
		const ring = canvasElement.querySelector<SVGElement>('.og-focus-ring')!;
		(document.activeElement as HTMLElement | null)?.blur();

		// Tab shows the focus indicator; Enter opens the menu.
		await userEvent.tab();
		await expect(document.activeElement).toBe(trigger);
		await expect(getComputedStyle(ring).opacity).toBe('1');
		await userEvent.keyboard('{Enter}');
		await waitFor(() => expect(menu()).not.toBeNull());

		// Arrow keys move the highlight; Enter chooses.
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await waitFor(() => expect(items()[2].hasAttribute('data-highlighted')).toBe(true));
		await userEvent.keyboard('{Enter}');
		await waitFor(() => expect(menu()).toBeNull());
		await expect(keyboard.value).toBe('third');
		trigger.blur();
		keyboard.value = '';
	}}
>
	<div class="field">
		<Select
			bind:value={keyboard.value}
			items={options}
			placeholder="Select an option..."
			aria-label="Keyboard"
		/>
	</div>
</Story>

<Story
	name="Allow empty"
	asChild
	play={async ({ canvasElement }) => {
		const [plain, search] = canvasElement.querySelectorAll<HTMLElement>('.og-select-field');
		const value = () => plain.querySelector('.og-select-value')!;

		// The empty option comes first, labelled like a placeholder.
		await userEvent.click(plain);
		await waitFor(() => expect(menu()).not.toBeNull());
		const none = items()[0];
		await expect(none.textContent?.trim()).toBe('No option');
		const label = none.querySelector('.og-select-item-label')!;
		await expect(sameColor(getComputedStyle(label).color, colors['dark-secondary'])).toBe(true);
		await expect(none.querySelector('.og-select-check svg')).toBeNull();

		// Choosing it clears the value, and the placeholder comes back.
		await userEvent.click(none);
		await waitFor(() => expect(menu()).toBeNull());
		await expect(optional.value).toBe('');
		await expect(value().textContent?.trim()).toBe('Select an option...');
		await expect(value().hasAttribute('data-placeholder')).toBe(true);

		// With nothing selected, the empty option holds the check.
		await userEvent.click(plain);
		await waitFor(() => expect(menu()).not.toBeNull());
		await expect(items()[0].querySelector('.og-select-check svg')).not.toBeNull();
		await closeMenu();

		// With typeahead, it's there until the user starts typing, and clears the field.
		const input = search.querySelector<HTMLInputElement>('input')!;
		await userEvent.click(input);
		await waitFor(() => expect(menu()).not.toBeNull());
		await expect(items()[0].textContent?.trim()).toBe('None');
		await userEvent.clear(input);
		await userEvent.type(input, 'sw');
		await waitFor(() =>
			expect(items().map((item) => item.textContent?.trim())).toEqual(['Sweden', 'Switzerland'])
		);
		await userEvent.clear(input);
		await waitFor(() => expect(items()[0].textContent?.trim()).toBe('None'));
		await userEvent.click(items()[0]);
		await waitFor(() => expect(menu()).toBeNull());
		await expect(optional.country).toBe('');
		await expect(input.value).toBe('');
		input.blur();

		optional.value = 'second';
		optional.country = 'sweden';
	}}
>
	<div class="row stage">
		<div class="field">
			<Select
				allowEmpty
				emptyOptionLabel="No option"
				bind:value={optional.value}
				items={options}
				placeholder="Select an option..."
				aria-label="Optional option"
			/>
		</div>
		<div class="field">
			<Select
				allowEmpty
				typeahead
				bind:value={optional.country}
				items={countries}
				icon={Globe}
				placeholder="Search countries..."
				aria-label="Optional country"
			/>
		</div>
	</div>
</Story>

<Story
	name="Disabled"
	asChild
	play={async ({ canvasElement }) => {
		const trigger = canvasElement.querySelector<HTMLButtonElement>('.og-select-field')!;
		await expect(trigger.disabled).toBe(true);
		await expect(sameColor(getComputedStyle(trigger).color, colors['dark-secondary'])).toBe(true);
		await userEvent.click(trigger, { pointerEventsCheck: 0 });
		await expect(menu()).toBeNull();
	}}
>
	<div class="field">
		<Select items={options} value="second" disabled icon={Shapes} aria-label="Disabled" />
	</div>
</Story>

<style>
	.grid {
		display: grid;
		grid-template-columns: max-content 180px 180px;
		gap: 20px;
		align-items: center;
	}
	.row {
		display: flex;
		gap: 20px;
	}
	.field {
		width: 180px;
	}
	.stage {
		margin: 24px;
	}
	.flip {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: calc(100vh - 2rem);
		min-height: 200px;
	}
</style>
