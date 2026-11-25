<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, spyOn, userEvent, waitFor } from 'storybook/test';
	import { CalendarClock, Bell, Shapes, Tag, Trash2 } from '@lucide/svelte';
	import { Form, FormField, FormGroup, RowButton, Select, Switch, Text, TextInput } from '#lib';
	import { backgrounds, colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Forms/Form',
		component: Form,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'A form (Forms.md): groups of fields and buttons, 16px apart, up to 650px wide with no minimum width. Every field and button sits in a `<FormGroup>`, which can have a short title; the first group usually has none. Fields in a group are separated by a line. Within a form, either every field has an icon or none does (mixing them logs a warning in development).'
				}
			}
		}
	});

	const description =
		'A lengthy description of this field and what it does. This can be multiple lines.';

	const event = $state({
		title: '',
		allDay: true,
		starts: '',
		repeat: 'never',
		reminder: true
	});

	const repeats = [
		{ value: 'never', label: 'Never' },
		{ value: 'daily', label: 'Every day' },
		{ value: 'weekly', label: 'Every week' }
	];

	let submitted = $state(0);
	function submit(event: SubmitEvent) {
		event.preventDefault();
		submitted++;
	}

	const rect = (el: Element) => el.getBoundingClientRect();
</script>

{#snippet exploration()}
	<Form onsubmit={submit}>
		<FormGroup>
			<FormField label="Field label">
				<TextInput placeholder="Write something..." />
			</FormField>
		</FormGroup>
		<FormGroup title="Group title">
			<FormField label="Boolean field">
				<Switch checked />
			</FormField>
			<FormField label="Field label" {description}>
				<TextInput placeholder="dd/mm/yyyy, 00:00 am" />
			</FormField>
		</FormGroup>
		<FormGroup>
			<RowButton colorway="danger" icon={Shapes}>Dangerous button</RowButton>
		</FormGroup>
	</Form>
{/snippet}

<Story
	name="Exploration"
	asChild
	play={async ({ canvasElement }) => {
		const form = canvasElement.querySelector<HTMLFormElement>('form.og-form')!;
		const groups = [...form.querySelectorAll<HTMLElement>(':scope > .og-form-group')];
		const bodies = groups.map((g) => g.querySelector<HTMLElement>('.og-form-group-body')!);

		// Form Exploration.sketchframe: a 500px form; groups 16px apart.
		await expect(rect(form).width).toBe(500);
		await expect(groups).toHaveLength(3);
		await expect(rect(groups[1]).top - rect(groups[0]).bottom).toBe(16);
		await expect(rect(groups[2]).top - rect(groups[1]).bottom).toBe(16);

		// Bodies: Background 2 (Acrylic), 8px padding, 16px smooth corners.
		for (const body of bodies) {
			await expect(sameColor(getComputedStyle(body).backgroundColor, backgrounds.acrylic)).toBe(
				true
			);
			await expect(getComputedStyle(body).padding).toBe('8px');
			await waitFor(() => expect(getComputedStyle(body).clipPath).toMatch(/^path\(/));
		}
		await expect(rect(bodies[0]).height).toBe(46);
		await expect(rect(bodies[2]).height).toBe(46);

		// The untitled first group has no title or group role; the second is named by its
		// title, a Subtitle in Dark (Secondary) 4px above the body.
		await expect(groups[0].querySelector('.og-form-group-title')).toBeNull();
		await expect(groups[0].getAttribute('role')).toBeNull();
		const title = groups[1].querySelector<HTMLElement>('.og-form-group-title')!;
		await expect(groups[1].getAttribute('role')).toBe('group');
		await expect(groups[1].getAttribute('aria-labelledby')).toBe(title.id);
		await expect(getComputedStyle(title).fontSize).toBe('11px');
		await expect(getComputedStyle(title).textTransform).toBe('uppercase');
		await expect(sameColor(getComputedStyle(title).color, colors['dark-secondary'])).toBe(true);
		await expect(rect(bodies[1]).top - rect(title).bottom).toBe(4);
		await expect(rect(title).left).toBe(rect(form).left);

		// Fields: 24px for the switch row, then a 1px separator 8px below it.
		const fields = [...bodies[1].querySelectorAll<HTMLElement>('.og-form-field')];
		await expect(rect(fields[0]).height).toBe(24);
		await expect(rect(fields[1]).top - rect(fields[0]).bottom).toBe(8);
		await expect(getComputedStyle(fields[1]).borderTopWidth).toBe('1px');
		// 8px padding, the switch row, then the separated field (its description wraps to
		// two lines in the Sketch file, but line breaks depend on font rendering).
		await expect(rect(bodies[1]).height).toBe(8 + 24 + 8 + rect(fields[1]).height + 8);
		await expect(rect(fields[1]).height).toBeGreaterThanOrEqual(1 + 8 + 54);

		// The button fills its group.
		const button = bodies[2].querySelector<HTMLElement>('.og-button-row')!;
		await expect(rect(button).width).toBe(484);
	}}
>
	<div class="layout">
		<div class="form-500">{@render exploration()}</div>
		<p class="og-label note">
			All fields and buttons within a form must be contained within at least one form group. Groups
			can contain titles to explain their contents, but do not need to if their contents are
			self-explanatory.
			<br /><br />
			Fields within each group are ordered left-to-right on sufficiently wide devices, and should be separated
			by a horizontal line.
			<br /><br />
			Forms should be at most 650px wide. (The Sketch file also sets a 300px minimum, which was dropped
			so forms fit narrow phones.)
		</p>
	</div>
</Story>

<Story
	name="Narrow sheet"
	asChild
	play={async ({ canvasElement }) => {
		const form = canvasElement.querySelector<HTMLFormElement>('form.og-form')!;
		await expect(rect(form).width).toBe(320);

		// Text inputs move below their labels and span the field; the switch stays put.
		const fields = [...form.querySelectorAll<HTMLElement>('.og-form-field')];
		const [text, toggle, described] = fields;
		const input = text.querySelector('.og-text-input')!;
		await expect(rect(input).top).toBeGreaterThan(rect(text.querySelector('label')!).bottom);
		await expect(rect(input).width).toBe(rect(text).width);
		await expect(rect(toggle).height).toBe(24);
		await expect(
			rect(described.querySelector('.og-text-input')!).top -
				rect(described.querySelector('.og-form-field-description')!).bottom
		).toBe(8);
	}}
>
	<div class="sheet">{@render exploration()}</div>
</Story>

<Story
	name="Narrow phone and maximum width"
	asChild
	play={async ({ canvasElement }) => {
		const form = (c: string) =>
			canvasElement.querySelector<HTMLFormElement>(`[data-case="${c}"] form.og-form`)!;
		// A 320px phone with 20px margins leaves 280px: the form shrinks to fit rather
		// than overflowing, and its fields stack.
		await expect(rect(form('min')).width).toBe(280);
		const fieldInput = form('min').querySelector('.og-form-field .og-text-input')!;
		await expect(rect(fieldInput).width).toBe(280 - 16);
		await expect(rect(form('max')).width).toBe(650);
	}}
>
	<div class="bounds">
		<div class="tiny" data-case="min">{@render exploration()}</div>
		<div class="wide" data-case="max">{@render exploration()}</div>
	</div>
</Story>

<Story name="Mobile" asChild globals={{ viewport: { value: 'mobile1', isRotated: false } }}>
	<div class="mobile">{@render exploration()}</div>
</Story>

<Story
	name="With icons"
	asChild
	play={async ({ canvasElement }) => {
		const form = canvasElement.querySelector<HTMLFormElement>('form.og-form')!;
		const fields = [...form.querySelectorAll<HTMLElement>('.og-form-field')];
		for (const field of fields) {
			await expect(field.querySelector('.og-form-field-icon')).not.toBeNull();
		}
		// Labels line up across fields, after the icon.
		const lefts = fields.map((f) => rect(f.querySelector('.og-form-field-text')!).left);
		await expect(new Set(lefts).size).toBe(1);

		// The required title blocks submitting until it's filled in; then it submits.
		const save = canvasElement.querySelector<HTMLElement>('[data-testid="save"]')!;
		const before = submitted;
		await userEvent.click(save);
		await expect(submitted).toBe(before);
		await userEvent.type(form.querySelector('input')!, 'Team lunch');
		await userEvent.click(canvasElement.querySelector('[data-testid="save"]')!);
		await expect(submitted).toBe(before + 1);
	}}
>
	<div class="form-500">
		<Form onsubmit={submit}>
			<FormGroup>
				<FormField label="Title" icon={Tag} required>
					<TextInput bind:value={event.title} placeholder="Team lunch..." />
				</FormField>
			</FormGroup>
			<FormGroup title="Schedule">
				<FormField label="All day" icon={CalendarClock}>
					<Switch bind:checked={event.allDay} />
				</FormField>
				<FormField label="Starts" icon={CalendarClock} description="In your local time zone.">
					<TextInput type="datetime-local" bind:value={event.starts} />
				</FormField>
				<FormField label="Repeat" icon={CalendarClock}>
					<Select bind:value={event.repeat} items={repeats} />
				</FormField>
				<!-- Display-only content can sit in a group alongside its fields. -->
				<p class="og-small-label summary" data-testid="summary">
					{event.allDay ? 'All day' : 'Timed'} · {repeats.find((r) => r.value === event.repeat)
						?.label}
				</p>
			</FormGroup>
			<FormGroup title="Alerts">
				<FormField label="Remind me" icon={Bell}>
					<Switch bind:checked={event.reminder} />
				</FormField>
			</FormGroup>
			<FormGroup>
				<RowButton type="submit" data-testid="save">Save event</RowButton>
				<RowButton colorway="danger" icon={Trash2}>Delete event</RowButton>
			</FormGroup>
		</Form>
	</div>
</Story>

<Story
	name="Mixed icons warning"
	asChild
	beforeEach={() => {
		const warn = spyOn(console, 'warn').mockImplementation(() => {});
		return () => warn.mockRestore();
	}}
	play={async () => {
		await expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('give every field an icon or none')
		);
		await expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('must not have its own icon')
		);
	}}
>
	<div class="form-500">
		<Text variant="caption" as="p">
			Mixing fields with and without icons, or an input icon inside a field icon, logs a warning in
			development.
		</Text>
		<Form>
			<FormGroup>
				<FormField label="With icon" icon={Tag}>
					<TextInput icon={Shapes} placeholder="Doubled icon..." />
				</FormField>
				<FormField label="Without icon">
					<TextInput placeholder="No icon..." />
				</FormField>
			</FormGroup>
		</Form>
	</div>
</Story>

<style>
	.layout {
		display: flex;
		gap: 20px;
		align-items: flex-start;
	}
	.form-500 {
		width: 500px;
	}
	.note {
		width: 270px;
		margin: 0;
		font-size: 13px;
		line-height: 16px;
	}
	.sheet {
		width: 320px;
	}
	.bounds {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	.tiny {
		width: 280px;
	}
	.wide {
		width: 900px;
	}
	.mobile {
		max-width: 100%;
	}
	.summary {
		margin: 0;
		padding-left: 4px;
	}
</style>
