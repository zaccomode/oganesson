<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import { Shapes } from '@lucide/svelte';
	import { FormField, FormGroup, Select, Switch, Text, TextInput, type SelectOption } from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Forms/FormField',
		component: FormField,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'A labelled input in a form (Forms.md). The label and optional description sit left of the input and move above it when the field is narrower than 400px. Text inputs and selects share the row equally with the label; a switch stays at the right and the label fills the rest. Required fields show a red asterisk; an optional icon identifies the field. The field wires its label and description to the Oganesson input inside it, or to any control through the children snippet’s props.'
				}
			}
		}
	});

	const description =
		'A lengthy description of this field and what it does. This can be multiple lines.';
	const placeholder = 'dd/mm/yyyy, 00:00 am';

	/** The eight variants of Forms-Form Field.sketchframe: required / description / icon. */
	const variants = [false, true].flatMap((icon) =>
		[false, true].flatMap((desc) =>
			[false, true].map((required) => ({
				key: `${required ? 'req' : 'opt'}-${desc ? 'desc' : 'plain'}-${icon ? 'icon' : 'noicon'}`,
				required,
				desc,
				icon
			}))
		)
	);

	const options: SelectOption[] = [
		{ value: 'daily', label: 'Daily' },
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'monthly', label: 'Monthly' }
	];

	const values = $state({ name: '', frequency: '', notify: false, colour: '#5155ef' });

	const rect = (el: Element) => el.getBoundingClientRect();
</script>

<Story
	name="States"
	asChild
	play={async ({ canvasElement }) => {
		const outer = (key: string) =>
			canvasElement.querySelector<HTMLElement>(`.og-form-field[data-case="${key}"]`)!;
		// The field's row, inside any separator above it.
		const field = (key: string) => outer(key).querySelector<HTMLElement>('.og-form-field-layout')!;
		const part = (key: string, selector: string) =>
			field(key).querySelector<HTMLElement>(selector)!;

		for (const { key, required, desc, icon } of variants) {
			const f = field(key);
			const text = part(key, '.og-form-field-text');
			const input = part(key, '.og-text-input');
			const label = part(key, 'label');

			// 484px wide in a group; the label column and the input share the row equally.
			await expect(rect(f).width).toBe(484);
			await expect(rect(text).width).toBe(icon ? 224 : 236);
			await expect(rect(input).width).toBe(icon ? 224 : 236);
			await expect(rect(input).right).toBe(rect(f).right);
			await expect(rect(input).height).toBe(30);

			// 4px left padding, then the icon (16px) and an 8px gap.
			const textLeft = icon ? 28 : 4;
			await expect(rect(text).left - rect(f).left).toBe(textLeft);

			// Without a description the label is centred on the input; with one it sits 4px
			// down. The icon lines up with the label.
			await expect(rect(label).top - rect(f).top).toBe(desc ? 4 : 6);
			if (icon) {
				const svg = part(key, '.og-form-field-icon .og-icon');
				await expect(rect(svg).width).toBe(16);
				await expect(rect(svg).left - rect(f).left).toBe(4);
				await expect(rect(svg).top - rect(f).top).toBe(desc ? 5 : 7);
			}

			// Label text style, and the red asterisk 2px after it.
			await expect(getComputedStyle(label).fontSize).toBe('14px');
			await expect(getComputedStyle(label).color).toBe('rgb(33, 37, 43)');
			const asterisk = f.querySelector<HTMLElement>('.og-form-field-required');
			if (required) {
				await expect(asterisk!.textContent).toBe('*');
				await expect(getComputedStyle(asterisk!).color).toBe('rgb(206, 30, 12)');
				await expect(rect(asterisk!).left - rect(label).right).toBe(2);
				await expect(asterisk!.getAttribute('aria-hidden')).toBe('true');
			} else {
				await expect(asterisk).toBeNull();
			}

			// The description: Small Label in Dark (Secondary), 2px below the label.
			const descEl = f.querySelector<HTMLElement>('.og-form-field-description');
			if (desc) {
				await expect(getComputedStyle(descEl!).fontSize).toBe('12px');
				await expect(getComputedStyle(descEl!).lineHeight).toBe('15px');
				await expect(sameColor(getComputedStyle(descEl!).color, colors['dark-secondary'])).toBe(
					true
				);
				await expect(rect(descEl!).top - rect(label).bottom).toBe(2);
			} else {
				await expect(descEl).toBeNull();
			}

			// Wiring: the label names the input, the description describes it.
			const control = input.querySelector('input')!;
			await expect(label.getAttribute('for')).toBe(control.id);
			await expect(control.getAttribute('aria-describedby')).toBe(descEl?.id ?? null);
			await expect(control.required).toBe(required);
		}

		// Fields are separated by a 1px Dark Thick Glass line, 8px from each.
		const second = outer(variants[1].key);
		await expect(getComputedStyle(second).borderTopWidth).toBe('1px');
		await expect(
			sameColor(getComputedStyle(second).borderTopColor, colors['dark-thick-glass'])
		).toBe(true);
		await expect(getComputedStyle(second).paddingTop).toBe('8px');
	}}
>
	<div class="states">
		{#each [false, true] as icon (icon)}
			<div class="column">
				<Text variant="caption" as="p">{icon ? 'With icon' : 'No icon'}</Text>
				<FormGroup>
					{#each variants.filter((v) => v.icon === icon) as v (v.key)}
						<FormField
							data-case={v.key}
							label="Field label"
							required={v.required}
							description={v.desc ? description : undefined}
							icon={v.icon ? Shapes : undefined}
						>
							<TextInput {placeholder} />
						</FormField>
					{/each}
				</FormGroup>
			</div>
		{/each}
	</div>
</Story>

<Story
	name="Inputs"
	asChild
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const field = (c: string) =>
			canvasElement.querySelector<HTMLElement>(`.og-form-field[data-case="${c}"]`)!;

		// Each label names its input, whatever the input.
		const name = canvas.getByLabelText<HTMLInputElement>('Name');
		await expect(name.tagName).toBe('INPUT');
		await expect(name.required).toBe(true);
		const frequency = canvas.getByLabelText('Frequency');
		await expect(frequency.closest('.og-select')).not.toBeNull();
		const notify = canvas.getByLabelText('Notifications');
		await expect(notify.getAttribute('role')).toBe('switch');
		const colour = canvas.getByLabelText<HTMLInputElement>('Colour');
		await expect(colour.type).toBe('color');

		// Descriptions describe their input.
		const describedBy = (el: HTMLElement) =>
			document.getElementById(el.getAttribute('aria-describedby')!)!.textContent?.trim();
		await expect(describedBy(frequency)).toBe('How often we send a summary.');
		await expect(describedBy(colour)).toBe('Used for your events in the calendar.');

		// An id given to the input is kept, and the label points at it.
		const own = canvas.getByLabelText('Own id');
		await expect(own.id).toBe('custom-id');

		// Typing into the field by clicking its label.
		await userEvent.click(canvasElement.querySelector('label[for="' + name.id + '"]')!);
		await expect(document.activeElement).toBe(name);
		await userEvent.keyboard('Ada');
		await expect(values.name).toBe('Ada');
		name.blur();

		// The switch is fixed-width: it sits at the right and the label fills the row.
		const switchField = field('switch');
		const track = switchField.querySelector<HTMLElement>('.og-switch-track')!;
		await expect(rect(track).right).toBe(rect(switchField).right);
		await expect(rect(switchField.querySelector('.og-form-field-text')!).width).toBe(
			484 - 4 - 8 - 52
		);
		await userEvent.click(switchField.querySelector('label')!);
		await expect(notify.getAttribute('aria-checked')).toBe('true');
		await userEvent.click(switchField.querySelector('label')!);

		// Select and text inputs share the row equally.
		const selectField = field('select');
		await expect(rect(selectField.querySelector('.og-select')!).width).toBe(236);
	}}
>
	<div class="single">
		<FormGroup>
			<FormField data-case="text" label="Name" required>
				<TextInput bind:value={values.name} placeholder="Jane Doe..." />
			</FormField>
			<FormField data-case="select" label="Frequency" description="How often we send a summary.">
				<Select bind:value={values.frequency} items={options} placeholder="Choose..." />
			</FormField>
			<FormField data-case="switch" label="Notifications">
				<Switch bind:checked={values.notify} />
			</FormField>
			<FormField
				data-case="custom"
				label="Colour"
				description="Used for your events in the calendar."
			>
				{#snippet children(props)}
					<input type="color" bind:value={values.colour} {...props} />
				{/snippet}
			</FormField>
			<FormField data-case="own-id" label="Own id">
				<TextInput id="custom-id" placeholder="Anything..." />
			</FormField>
		</FormGroup>
	</div>
</Story>

<Story
	name="Narrow"
	asChild
	play={async ({ canvasElement }) => {
		const field = (c: string) =>
			canvasElement.querySelector<HTMLElement>(`.og-form-field[data-case="${c}"]`)!;

		// Under 400px wide, the label and description move above the input, which spans
		// the field's full width.
		for (const c of ['plain', 'icon']) {
			const f = field(c);
			const text = f.querySelector('.og-form-field-text')!;
			const input = f.querySelector('.og-text-input')!;
			await expect(rect(f).width).toBe(304);
			await expect(rect(input).width).toBe(304);
			await expect(rect(input).left).toBe(rect(f).left);
			await expect(rect(input).top - rect(text).bottom).toBe(8);
			await expect(rect(text).left - rect(f).left).toBe(c === 'icon' ? 28 : 4);
		}

		// A switch stays beside its label.
		const sw = field('switch').querySelector<HTMLElement>('.og-form-field-layout')!;
		await expect(rect(sw.querySelector('.og-switch-track')!).right).toBe(rect(sw).right);
		await expect(rect(sw).height).toBe(24);
	}}
>
	<div class="narrow">
		<FormGroup>
			<FormField data-case="plain" label="Field label" required {description}>
				<TextInput {placeholder} />
			</FormField>
			<FormField data-case="icon" label="Field label" {description} icon={Shapes}>
				<TextInput {placeholder} />
			</FormField>
			<FormField data-case="switch" label="Boolean field">
				<Switch />
			</FormField>
		</FormGroup>
	</div>
</Story>

<style>
	.states {
		display: flex;
		flex-wrap: wrap;
		gap: 50px;
	}
	.column {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 500px;
	}
	.single {
		width: 500px;
	}
	.narrow {
		width: 320px;
	}
</style>
