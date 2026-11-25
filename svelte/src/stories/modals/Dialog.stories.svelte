<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, waitFor } from 'storybook/test';
	import { Gem, Trash2 } from '@lucide/svelte';
	import { Button, Dialog, Text } from '#lib';
	import { backgrounds } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Modals/Dialog',
		component: Dialog,
		tags: ['autodocs'],
		args: { onConfirm: fn(), onCancel: fn() },
		parameters: {
			docs: {
				description: {
					component:
						'A dialog modal (Modals.md): a small alert or confirmation with a 3-5 word title and a 1-2 sentence description. Cancel sits on the left and the prominent confirm action on the right; **cancel has focus when it opens**, and Tab or the arrow keys move between the actions. It uses the elevated Acrylic style over the dimmed, blurred page. Pressing the background or Escape closes it as a cancellation by default; either can be turned off.'
				}
			}
		}
	});

	const description =
		'A short blurb, typically 1-2 sentences, explaining the purpose and/or ramifications of this action.';

	/** The open dialog, which is portalled to the end of the document. */
	const dialog = () => document.querySelector<HTMLElement>('.og-dialog');
	const overlay = () => document.querySelector<HTMLElement>('.og-modal-overlay');
	const surface = () => dialog()!.querySelector<HTMLElement>('.og-dialog-surface')!;
	const buttonNamed = (name: string) =>
		[...dialog()!.querySelectorAll<HTMLElement>('button')].find(
			(b) => (b.getAttribute('aria-label') ?? b.textContent?.trim()) === name
		)!;
	const rect = (el: Element) => el.getBoundingClientRect();
	const round = (n: number) => Math.round(n);

	async function openDialog(canvas: HTMLElement) {
		await userEvent.click(canvas.querySelector<HTMLElement>('[data-testid="open"]')!);
		await waitFor(() => expect(dialog()).not.toBeNull());
		await waitFor(() => expect(getComputedStyle(surface()).opacity).toBe('1'));
	}

	async function closed() {
		await waitFor(() => expect(dialog()).toBeNull());
		await waitFor(() => expect(overlay()).toBeNull());
	}

	/** Presses the dimmed page, away from the dialog. */
	async function pressBackground() {
		await userEvent.pointer({ keys: '[MouseLeft]', target: overlay()!, coords: { x: 5, y: 5 } });
	}
</script>

<script lang="ts">
	let confirmed = $state(0);
	let cancelled = $state(0);
</script>

{#snippet openButton({ props }: { props: Record<string, unknown> })}
	<Button {...props} data-testid="open">Open dialog</Button>
{/snippet}

<Story name="Playground" args={{ title: 'Modal Title', description }}>
	{#snippet template(args)}
		<Dialog {...args} trigger={openButton} />
	{/snippet}
</Story>

<!-- Dialog Modal.sketchframe: the dialog over the dimmed, blurred page. -->
<Story
	name="Dialog"
	asChild
	play={async ({ canvasElement }) => {
		await openDialog(canvasElement);
		const box = rect(dialog()!);

		// 400px wide, centred, 160px tall: 16px padding around a 30px header, the
		// two-line description and the 30px actions row, 16px apart.
		await expect(box.width).toBe(400);
		await expect(round(box.left + box.width / 2)).toBe(round(innerWidth / 2));
		await expect(round(box.top + box.height / 2)).toBe(round(innerHeight / 2));
		const header = dialog()!.querySelector<HTMLElement>('.og-modal-header')!;
		const text = dialog()!.querySelector<HTMLElement>('.og-dialog-description')!;
		const actions = dialog()!.querySelector<HTMLElement>('.og-dialog-actions')!;
		await expect(rect(header).top - box.top).toBe(16);
		await expect(rect(header).left - box.left).toBe(16);
		await expect(rect(header).height).toBe(30);
		await expect(rect(text).top - rect(header).bottom).toBe(16);
		await expect(rect(actions).top - rect(text).bottom).toBe(16);
		await expect(box.bottom - rect(actions).bottom).toBe(16);
		await expect(rect(actions).height).toBe(30);

		// The title (Title style) and a close button in the top right.
		const title = dialog()!.querySelector<HTMLElement>('h2.og-modal-title')!;
		await expect(title.textContent).toBe('Modal Title');
		await expect(getComputedStyle(title).fontSize).toBe('18px');
		await expect(dialog()!.getAttribute('aria-labelledby')).toBe(title.id);
		await expect(dialog()!.getAttribute('aria-describedby')).toBe(text.id);
		await expect(dialog()!.getAttribute('role')).toBe('alertdialog');
		const close = buttonNamed('Close');
		await expect(round(box.right - rect(close).right)).toBe(16);
		await expect(rect(close).width).toBe(30);

		// Cancel on the left, the prominent confirm on the right, 8px apart, right-aligned.
		const cancel = buttonNamed('Nevermind');
		const confirm = buttonNamed('Confirm');
		await expect(round(rect(confirm).left - rect(cancel).right)).toBe(8);
		await expect(round(box.right - rect(confirm).right)).toBe(16);
		await expect(confirm.dataset.appearance).toBe('prominent');
		await expect(cancel.dataset.appearance).toBe('subtle');

		// Acrylic (Elevated): translucent white, a 10px backdrop blur, the elevated shadow,
		// 22px smooth corners.
		await expect(sameColor(getComputedStyle(surface()).backgroundColor, backgrounds.acrylic)).toBe(
			true
		);
		await expect(getComputedStyle(surface()).backdropFilter).toBe('blur(10px)');
		await expect(getComputedStyle(dialog()!).boxShadow).toContain('9px 20px');
		await waitFor(() => expect(getComputedStyle(surface()).clipPath).toMatch(/^path\(/));

		// Behind it, the page is 23.9% black with a 24px blur.
		await expect(getComputedStyle(overlay()!).backgroundColor).toBe('rgba(0, 0, 0, 0.24)');
		await expect(getComputedStyle(overlay()!).backdropFilter).toBe('blur(24px)');

		// Motion: scale and shadow on the dialog; every child (the surface and Lisse's
		// inner-shadow overlay beside it) fades, so WebKit keeps the acrylic blur.
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		await expect(getComputedStyle(dialog()!).opacity).toBe('1');
		await expect(getComputedStyle(dialog()!).filter).toBe('none');
		await expect(getComputedStyle(dialog()!).transitionProperty).toBe('scale, box-shadow');
		await expect(dialog()!.children.length).toBeGreaterThan(1);
		for (const child of dialog()!.children) {
			await expect(getComputedStyle(child).transitionProperty).toBe('opacity, filter');
			await expect(getComputedStyle(child).transitionDuration).toBe(
				reduced ? '0s, 0s' : '0.1s, 0.1s'
			);
		}

		// Confirming fires onConfirm and closes the dialog.
		await userEvent.click(confirm);
		await closed();
		await expect(confirmed).toBe(1);
		await expect(cancelled).toBe(0);
		confirmed = 0;
	}}
>
	<div class="page">
		<Text variant="large-title">Account</Text>
		<Text>Content behind the dialog shows through its blurred, dimmed background.</Text>
		<Dialog
			title="Modal Title"
			{description}
			cancelLabel="Nevermind"
			confirmIcon={Gem}
			trigger={openButton}
			onConfirm={() => {
				confirmed++;
			}}
			onCancel={() => cancelled++}
		/>
	</div>
</Story>

<!-- Modals.md: cancel has focus by default; Tab or the arrow keys reach confirm. -->
<Story
	name="Focus order"
	asChild
	play={async ({ canvasElement }) => {
		await openDialog(canvasElement);
		const close = buttonNamed('Close');
		const cancel = buttonNamed('Keep account');
		const confirm = buttonNamed('Delete');

		await waitFor(() => expect(document.activeElement).toBe(cancel));
		await userEvent.keyboard('{ArrowRight}');
		await expect(document.activeElement).toBe(confirm);
		await userEvent.keyboard('{ArrowLeft}');
		await expect(document.activeElement).toBe(cancel);
		await userEvent.keyboard('{ArrowDown}');
		await expect(document.activeElement).toBe(confirm);
		await userEvent.keyboard('{ArrowUp}');
		await expect(document.activeElement).toBe(cancel);

		// Tab moves on to confirm, then wraps to the close button; focus stays inside.
		await userEvent.tab();
		await expect(document.activeElement).toBe(confirm);
		await userEvent.tab();
		await expect(document.activeElement).toBe(close);
		await userEvent.tab();
		await expect(document.activeElement).toBe(cancel);

		// Enter on the focused cancel action closes without confirming.
		await userEvent.keyboard('{Enter}');
		await closed();
		await expect(cancelled).toBe(1);
		await expect(confirmed).toBe(0);
		cancelled = 0;
		// Focus returns to the button that opened it.
		await waitFor(() =>
			expect(document.activeElement).toBe(canvasElement.querySelector('[data-testid="open"]'))
		);
	}}
>
	<Dialog
		title="Confirm account deletion"
		description="Your projects, files and settings will be permanently removed. This can't be undone."
		cancelLabel="Keep account"
		confirmLabel="Delete"
		confirmIcon={Trash2}
		trigger={openButton}
		onConfirm={() => {
			confirmed++;
		}}
		onCancel={() => cancelled++}
	/>
</Story>

<!-- Modals.md: the background, Escape and the close button all cancel by default. -->
<Story
	name="Closing"
	asChild
	play={async ({ canvasElement }) => {
		await openDialog(canvasElement);
		await pressBackground();
		await closed();
		await expect(cancelled).toBe(1);

		await openDialog(canvasElement);
		await userEvent.keyboard('{Escape}');
		await closed();
		await expect(cancelled).toBe(2);

		await openDialog(canvasElement);
		await userEvent.click(buttonNamed('Close'));
		await closed();
		await expect(cancelled).toBe(3);
		await expect(confirmed).toBe(0);
		cancelled = 0;
	}}
>
	<Dialog
		title="Discard draft"
		description="The message you were writing will be deleted."
		confirmLabel="Discard"
		trigger={openButton}
		onConfirm={() => {
			confirmed++;
		}}
		onCancel={() => cancelled++}
	/>
</Story>

<!-- Background press turned off; Escape follows it. -->
<Story
	name="Background press off"
	asChild
	play={async ({ canvasElement }) => {
		await openDialog(canvasElement);
		await pressBackground();
		await userEvent.keyboard('{Escape}');
		// Give a close the chance to start: it would have by now.
		await new Promise((resolve) => setTimeout(resolve, 150));
		await expect(dialog()).not.toBeNull();
		await expect(cancelled).toBe(0);

		await userEvent.click(buttonNamed('Cancel'));
		await closed();
		await expect(cancelled).toBe(1);
		cancelled = 0;
	}}
>
	<Dialog
		title="Leave the meeting"
		description="Everyone else will stay connected. You can rejoin from the invitation."
		confirmLabel="Leave"
		closeOnBackgroundPress={false}
		trigger={openButton}
		onCancel={() => cancelled++}
	/>
</Story>

<!-- Escape set separately: the background is off, but Escape still cancels. -->
<Story
	name="Escape only"
	asChild
	play={async ({ canvasElement }) => {
		await openDialog(canvasElement);
		await pressBackground();
		await new Promise((resolve) => setTimeout(resolve, 150));
		await expect(dialog()).not.toBeNull();
		await userEvent.keyboard('{Escape}');
		await closed();
		await expect(cancelled).toBe(1);
		cancelled = 0;
	}}
>
	<Dialog
		title="Leave the meeting"
		description="Everyone else will stay connected. You can rejoin from the invitation."
		confirmLabel="Leave"
		closeOnBackgroundPress={false}
		closeOnEscape
		trigger={openButton}
		onCancel={() => cancelled++}
	/>
</Story>

<style>
	.page {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}
</style>
