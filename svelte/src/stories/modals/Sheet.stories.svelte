<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, waitFor } from 'storybook/test';
	import { ArrowRight } from '@lucide/svelte';
	import {
		Button,
		Form,
		FormField,
		FormGroup,
		RowButton,
		Select,
		Sheet,
		Switch,
		Text,
		TextInput
	} from '#lib';
	import { backgrounds } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Modals/Sheet',
		component: Sheet,
		tags: ['autodocs'],
		args: { onCancel: fn() },
		parameters: {
			docs: {
				description: {
					component:
						'A sheet modal (Modals.md) for longer flows, usually a form, or for enlarging details from the page beneath. It has a fixed `width` and `height`; content taller than the sheet scrolls beneath the header and footer, which sit on the scroll edge effect. On a smaller viewport the sheet keeps 16px clear of every edge. The footer holds up to three actions: tertiary (usually cancel, the same as the close button) on the far left, then secondary and primary on the right. Leave them out for static content. Pressing the background or Escape closes it as a cancellation by default; either can be turned off.'
				}
			}
		}
	});

	/** The open sheet, which is portalled to the end of the document. */
	const sheet = () => document.querySelector<HTMLElement>('.og-sheet');
	const overlay = () => document.querySelector<HTMLElement>('.og-modal-overlay');
	const part = (name: string) => sheet()!.querySelector<HTMLElement>(`.og-sheet-${name}`)!;
	const buttonNamed = (name: string) =>
		[...sheet()!.querySelectorAll<HTMLElement>('button')].find(
			(b) => (b.getAttribute('aria-label') ?? b.textContent?.trim()) === name
		)!;
	const rect = (el: Element) => el.getBoundingClientRect();
	const round = (n: number) => Math.round(n);

	async function openSheet(canvas: HTMLElement) {
		await userEvent.click(canvas.querySelector<HTMLElement>('[data-testid="open"]')!);
		await waitFor(() => expect(sheet()).not.toBeNull());
		await waitFor(() => expect(getComputedStyle(part('surface')).opacity).toBe('1'));
		// Measure once it has finished growing to full size.
		await waitFor(() => expect(getComputedStyle(sheet()!).scale).toMatch(/^(none|1)$/));
	}

	async function closed() {
		await waitFor(() => expect(sheet()).toBeNull());
		await waitFor(() => expect(overlay()).toBeNull());
	}

	const repeats = [
		{ value: 'never', label: 'Never' },
		{ value: 'daily', label: 'Every day' },
		{ value: 'weekly', label: 'Every week' }
	];
</script>

<script lang="ts">
	let cancelled = $state(0);
	let saved = $state(0);
	let step = $state(1);
	let formOpen = $state(false);

	const event = $state({ title: '', allDay: true, repeat: 'never', reminder: true, notes: '' });

	function save(e: SubmitEvent) {
		e.preventDefault();
		saved++;
		formOpen = false;
	}
</script>

{#snippet openButton({ props }: { props: Record<string, unknown> })}
	<Button {...props} data-testid="open">Open sheet</Button>
{/snippet}

{#snippet cancelAction({ close }: { close: () => void })}
	<Button onclick={close}>Cancel</Button>
{/snippet}

{#snippet backAction()}
	<Button onclick={() => (step = Math.max(1, step - 1))}>Back</Button>
{/snippet}

{#snippet nextAction()}
	<Button appearance="prominent" icon={ArrowRight} iconPosition="right" onclick={() => step++}>
		Next
	</Button>
{/snippet}

{#snippet longForm()}
	<Form id="event-form" onsubmit={save}>
		<FormGroup>
			<FormField label="Title" required>
				<TextInput bind:value={event.title} placeholder="Team lunch..." />
			</FormField>
		</FormGroup>
		<FormGroup title="Schedule">
			<FormField label="All day"><Switch bind:checked={event.allDay} /></FormField>
			<FormField label="Starts" description="In your local time zone.">
				<TextInput type="datetime-local" />
			</FormField>
			<FormField label="Ends" description="In your local time zone.">
				<TextInput type="datetime-local" />
			</FormField>
			<FormField label="Repeat"><Select bind:value={event.repeat} items={repeats} /></FormField>
		</FormGroup>
		<FormGroup title="Alerts">
			<FormField label="Remind me"><Switch bind:checked={event.reminder} /></FormField>
			<FormField label="Email guests"><Switch /></FormField>
		</FormGroup>
		<FormGroup title="Details">
			<FormField label="Location"><TextInput placeholder="Somewhere nice..." /></FormField>
			<FormField label="Notes" description="Shared with everyone invited.">
				<TextInput bind:value={event.notes} placeholder="Bring a jacket..." />
			</FormField>
		</FormGroup>
		<FormGroup>
			<RowButton colorway="danger">Delete event</RowButton>
		</FormGroup>
	</Form>
{/snippet}

<Story name="Playground" args={{ title: 'Modal Title', width: 470, height: 540 }}>
	{#snippet template(args)}
		<Sheet
			title={args.title}
			width={args.width}
			height={args.height}
			onCancel={args.onCancel}
			trigger={openButton}
			tertiaryAction={cancelAction}
			primaryAction={nextAction}
		>
			<Text>Sheet content.</Text>
		</Sheet>
	{/snippet}
</Story>

<!-- Sheet Modal.sketchframe: a 470 × 540 sheet with all three footer actions. -->
<Story
	name="Sheet"
	asChild
	play={async ({ canvasElement }) => {
		await openSheet(canvasElement);
		const box = rect(sheet()!);

		// A fixed 470 × 540, centred.
		await expect(box.width).toBe(470);
		await expect(box.height).toBe(540);
		await expect(round(box.left + box.width / 2)).toBe(round(innerWidth / 2));
		await expect(round(box.top + box.height / 2)).toBe(round(innerHeight / 2));

		// Background 1, the elevated shadow, 22px smooth corners; the page behind is 23.9%
		// black with an 8px blur.
		const surface = part('surface');
		await expect(sameColor(getComputedStyle(surface).backgroundColor, backgrounds['1'])).toBe(true);
		await expect(getComputedStyle(sheet()!).boxShadow).toContain('9px 20px');
		await waitFor(() => expect(getComputedStyle(surface).clipPath).toMatch(/^path\(/));
		await expect(getComputedStyle(overlay()!).backgroundColor).toBe('rgba(0, 0, 0, 0.24)');
		// The blur fades in with the background.
		await waitFor(() => expect(getComputedStyle(overlay()!).backdropFilter).toBe('blur(8px)'));

		// Header: 62px, the title 16px in, the close button 16px from the top right.
		const header = part('header');
		await expect(round(rect(header).height)).toBe(62);
		await expect(round(rect(header).top)).toBe(round(box.top));
		const title = header.querySelector<HTMLElement>('h2.og-modal-title')!;
		await expect(title.textContent).toBe('Modal Title');
		await expect(round(rect(title).left - box.left)).toBe(16);
		await expect(sheet()!.getAttribute('aria-labelledby')).toBe(title.id);
		await expect(sheet()!.getAttribute('role')).toBe('dialog');
		const close = buttonNamed('Close');
		await expect(round(rect(close).top - box.top)).toBe(16);
		await expect(round(box.right - rect(close).right)).toBe(16);

		// Footer: 62px; Cancel on the far left, Back and Next on the right, 8px apart.
		const footer = part('footer');
		await expect(round(rect(footer).height)).toBe(62);
		await expect(round(rect(footer).bottom)).toBe(round(box.bottom));
		const cancel = buttonNamed('Cancel');
		const back = buttonNamed('Back');
		const next = buttonNamed('Next');
		await expect(round(rect(cancel).left - box.left)).toBe(16);
		await expect(round(rect(next).left - rect(back).right)).toBe(8);
		await expect(round(box.right - rect(next).right)).toBe(16);
		await expect(round(rect(next).top - rect(footer).top)).toBe(16);

		// Both bars use the scroll edge effect: a fading Background 1 gradient over a
		// progressive blur that fades out towards the content.
		await expect(header.classList).toContain('og-scroll-edge');
		await expect(header.dataset.edge).toBe('top');
		await expect(footer.classList).toContain('og-scroll-edge');
		await expect(footer.dataset.edge).toBe('bottom');

		// Nothing in the content to focus, and nothing to scroll: the sheet itself has
		// focus, so no control shows a focus ring until the keyboard moves.
		await expect(document.activeElement).toBe(sheet());
		await userEvent.tab();
		await expect(document.activeElement).toBe(close);

		// The cancel action closes the sheet as a cancellation, like the close button.
		await userEvent.click(cancel);
		await closed();
		await expect(cancelled).toBe(1);
		cancelled = 0;
	}}
>
	<Sheet
		title="Modal Title"
		trigger={openButton}
		tertiaryAction={cancelAction}
		secondaryAction={backAction}
		primaryAction={nextAction}
		onCancel={() => cancelled++}
	>
		<Text>Step {step}</Text>
	</Sheet>
</Story>

<!-- A form longer than the sheet scrolls beneath the header and footer. -->
<Story
	name="Long form"
	asChild
	play={async ({ canvasElement }) => {
		await openSheet(canvasElement);
		const body = part('body');
		const header = part('header');
		const footer = part('footer');

		// The first field has focus, and the form starts below the header.
		const first = body.querySelector<HTMLInputElement>('input')!;
		await waitFor(() => expect(document.activeElement).toBe(first));
		const form = body.querySelector('form')!;
		await expect(round(rect(form).top - rect(header).bottom)).toBe(0);
		await expect(round(rect(form).left - rect(sheet()!).left)).toBe(16);

		// The content overflows; the body scrolls, not the sheet, so the header and
		// footer stay put while the form passes beneath them.
		await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
		// Controls scrolled into view (by Tab, say) stop clear of the header and footer.
		await expect(getComputedStyle(body).scrollPaddingTop).toBe('62px');
		await expect(getComputedStyle(body).scrollPaddingBottom).toBe('62px');
		const headerTop = rect(header).top;
		body.scrollTop = body.scrollHeight;
		await waitFor(() => expect(body.scrollTop).toBeGreaterThan(0));
		await expect(rect(header).top).toBe(headerTop);
		await expect(rect(form).top).toBeLessThan(rect(header).bottom);
		// Scrolled to the end, the last group clears the footer.
		const lastGroup = [...form.querySelectorAll('.og-form-group')].at(-1)!;
		await expect(rect(lastGroup).bottom).toBeLessThanOrEqual(rect(footer).top);
		body.scrollTop = 0;

		// Save submits the form inside the sheet (the button sits outside it, in the
		// footer); the form is required, so it waits for a title.
		await userEvent.click(buttonNamed('Save'));
		await expect(saved).toBe(0);
		await userEvent.type(first, 'Team lunch');
		await userEvent.click(buttonNamed('Save'));
		await closed();
		await expect(saved).toBe(1);
		// Saving isn't a cancellation.
		await expect(cancelled).toBe(0);
		saved = 0;
		event.title = '';
	}}
>
	<Sheet
		title="New event"
		bind:open={formOpen}
		trigger={openButton}
		tertiaryAction={cancelAction}
		onCancel={() => cancelled++}
	>
		{@render longForm()}
		{#snippet primaryAction()}
			<Button appearance="prominent" type="submit" form="event-form">Save</Button>
		{/snippet}
	</Sheet>
</Story>

<!-- Static content: no footer, and the body scrolls from the keyboard. -->
<Story
	name="Static content"
	asChild
	play={async ({ canvasElement }) => {
		await openSheet(canvasElement);
		await expect(sheet()!.querySelector('.og-sheet-footer')).toBeNull();
		const body = part('body');
		await expect(rect(sheet()!).height).toBe(400);

		// With nothing to focus inside, the overflowing body is itself focusable and has
		// focus, so arrow keys and Page Down scroll it.
		await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
		await waitFor(() => expect(document.activeElement).toBe(body));
		await expect(body.tabIndex).toBe(0);
		// Without a footer, the content ends 16px from the bottom.
		await expect(getComputedStyle(body).paddingBottom).toBe('16px');

		await userEvent.keyboard('{Escape}');
		await closed();
		await expect(cancelled).toBe(1);
		cancelled = 0;
	}}
>
	<Sheet
		title="Release notes"
		width={420}
		height={400}
		trigger={openButton}
		onCancel={() => cancelled++}
	>
		<div class="notes">
			{#each [8, 7, 6, 5, 4, 3, 2, 1] as minor (minor)}
				<Text variant="title-2" as="h3">Version 1.{minor}</Text>
				<Text>
					Faster sync, a refreshed sidebar and dozens of small fixes. Projects now open where you
					left them, and shared folders show who changed what.
				</Text>
			{/each}
		</div>
	</Sheet>
</Story>

<!-- Modals.md: a sheet larger than the viewport keeps 16px clear of every edge. -->
<Story
	name="Small viewport"
	asChild
	play={async ({ canvasElement }) => {
		await openSheet(canvasElement);
		const box = rect(sheet()!);
		const viewport = document.documentElement;
		await expect(round(box.left)).toBe(16);
		await expect(round(box.top)).toBe(16);
		await expect(round(viewport.clientWidth - box.right)).toBe(16);
		await expect(round(innerHeight - box.bottom)).toBe(16);

		// The footer stays at the bottom of the shrunken sheet, the close button in its
		// top-right corner.
		await expect(round(rect(part('footer')).bottom)).toBe(round(box.bottom));
		await expect(round(box.right - rect(buttonNamed('Close')).right)).toBe(16);

		await userEvent.click(buttonNamed('Close'));
		await closed();
		await expect(cancelled).toBe(1);
		cancelled = 0;
	}}
>
	<Sheet
		title="New event"
		width={4000}
		height={4000}
		trigger={openButton}
		tertiaryAction={cancelAction}
		onCancel={() => cancelled++}
	>
		{@render longForm()}
		{#snippet primaryAction()}
			<Button appearance="prominent" type="submit" form="event-form">Save</Button>
		{/snippet}
	</Sheet>
</Story>

<!-- Focus order: content first, then the footer actions left to right, then the
     close button; focus stays inside the sheet. -->
<Story
	name="Focus order"
	asChild
	play={async ({ canvasElement }) => {
		await openSheet(canvasElement);
		const fields = [...part('body').querySelectorAll<HTMLElement>('input, button')];
		await waitFor(() => expect(document.activeElement).toBe(fields[0]));
		for (const field of fields.slice(1)) {
			await userEvent.tab();
			await expect(document.activeElement).toBe(field);
		}
		for (const name of ['Cancel', 'Back', 'Next', 'Close']) {
			await userEvent.tab();
			await expect(document.activeElement).toBe(buttonNamed(name));
		}
		await userEvent.tab();
		await expect(document.activeElement).toBe(fields[0]);
		await userEvent.tab({ shift: true });
		await expect(document.activeElement).toBe(buttonNamed('Close'));

		await userEvent.keyboard('{Enter}');
		await closed();
		await expect(cancelled).toBe(1);
		cancelled = 0;
	}}
>
	<Sheet
		title="Invite people"
		height={400}
		trigger={openButton}
		tertiaryAction={cancelAction}
		secondaryAction={backAction}
		primaryAction={nextAction}
		onCancel={() => cancelled++}
	>
		<Form>
			<FormGroup>
				<FormField label="Email"><TextInput placeholder="jane@example.com..." /></FormField>
				<FormField label="Can edit"><Switch /></FormField>
			</FormGroup>
		</Form>
	</Sheet>
</Story>

<!-- A form where losing progress would be irritating: the background and Escape
     don't close it, only Cancel and the close button do. -->
<Story
	name="Background press off"
	asChild
	play={async ({ canvasElement }) => {
		await openSheet(canvasElement);
		await userEvent.pointer({ keys: '[MouseLeft]', target: overlay()!, coords: { x: 5, y: 5 } });
		await userEvent.keyboard('{Escape}');
		await new Promise((resolve) => setTimeout(resolve, 150));
		await expect(sheet()).not.toBeNull();
		await expect(cancelled).toBe(0);
		await userEvent.click(buttonNamed('Cancel'));
		await closed();
		await expect(cancelled).toBe(1);
		cancelled = 0;
	}}
>
	<Sheet
		title="New event"
		closeOnBackgroundPress={false}
		trigger={openButton}
		tertiaryAction={cancelAction}
		onCancel={() => cancelled++}
	>
		{@render longForm()}
		{#snippet primaryAction()}
			<Button appearance="prominent" type="submit" form="event-form">Save</Button>
		{/snippet}
	</Sheet>
</Story>

<style>
	.notes {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
