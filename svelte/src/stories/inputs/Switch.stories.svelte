<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, waitFor } from 'storybook/test';
	import { Switch, Text } from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Inputs/Switch',
		component: Switch,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'An on/off switch (Inputs.md), built on Bits UI. Pair it with a visible label, usually to its left. For lists of options, or where the state can be indeterminate, use a checkbox instead.'
				}
			}
		}
	});

	const settings = $state({ notifications: false, sync: true });
</script>

<Story
	name="States"
	asChild
	play={async ({ canvasElement }) => {
		const track = (c: string) =>
			canvasElement.querySelector<HTMLElement>(`[data-case="${c}"] .og-switch-track`)!;
		const off = track('off');
		const on = track('on');

		await expect(off.getBoundingClientRect()).toMatchObject({ width: 52, height: 24 });
		await expect(sameColor(getComputedStyle(off).backgroundColor, colors['dark-thin-glass'])).toBe(
			true
		);
		await expect(getComputedStyle(on).backgroundColor).toBe('rgb(33, 37, 43)');

		const thumb = (t: HTMLElement) => t.querySelector<HTMLElement>('.og-switch-thumb')!;
		await expect(thumb(off).getBoundingClientRect()).toMatchObject({ width: 24, height: 16 });
		await expect(thumb(on).getBoundingClientRect().left - on.getBoundingClientRect().left).toBe(24);
		await expect(getComputedStyle(thumb(on)).backgroundColor).toBe('rgb(255, 255, 255)');

		const disabled = canvasElement.querySelector<HTMLElement>('[data-case="disabled"] .og-switch')!;
		await expect(getComputedStyle(disabled).opacity).toBe('0.5');
	}}
>
	<div class="row">
		<span data-case="off"><Switch aria-label="Off" /></span>
		<span data-case="on"><Switch checked aria-label="On" /></span>
		<span data-case="disabled"><Switch disabled aria-label="Disabled" /></span>
		<span><Switch disabled checked aria-label="Disabled on" /></span>
	</div>
</Story>

<Story
	name="Press"
	asChild
	play={async ({ canvasElement }) => {
		// One session, so a press and its release count as a click.
		const user = userEvent.setup();
		const track = (c: string) =>
			canvasElement.querySelector<HTMLElement>(`[data-case="${c}"] .og-switch-track`)!;
		const thumbBox = (t: HTMLElement) => {
			const thumb = t.querySelector<HTMLElement>('.og-switch-thumb')!.getBoundingClientRect();
			const left = t.getBoundingClientRect().left;
			return { left: thumb.left - left, right: thumb.right - left, width: thumb.width };
		};

		for (const [c, rest, stretched, after] of [
			// Off: grows rightwards from the left edge, then slides right.
			['press-off', { left: 4, right: 28 }, { left: 4, right: 32 }, 'true'],
			// On: grows leftwards from the right edge, then slides left.
			['press-on', { left: 24, right: 48 }, { left: 20, right: 48 }, 'false']
		] as const) {
			const t = track(c);
			const before = t.getAttribute('aria-checked');
			await expect(thumbBox(t)).toMatchObject(rest);

			// No press layer on the track: the thumb stretch replaces it.
			await expect(getComputedStyle(t, '::after').backgroundColor).toBe('rgba(0, 0, 0, 0)');

			// Holding the pointer down stretches the thumb 4px towards its
			// destination without toggling.
			await user.pointer({ keys: '[MouseLeft>]', target: t });
			await waitFor(() => expect(thumbBox(t)).toMatchObject({ ...stretched, width: 28 }));
			await expect(t.getAttribute('aria-checked')).toBe(before);

			// Releasing toggles it, and the thumb slides across at its resting size.
			await user.pointer({ keys: '[/MouseLeft]', target: t });
			await expect(t.getAttribute('aria-checked')).toBe(after);
			const end = after === 'true' ? { left: 24, right: 48 } : { left: 4, right: 28 };
			await waitFor(() => expect(thumbBox(t)).toMatchObject({ ...end, width: 24 }));
		}

		// Releasing away from the switch cancels: no stretch, no toggle.
		const off = track('press-cancel');
		await user.pointer({ keys: '[MouseLeft>]', target: off });
		await waitFor(() => expect(thumbBox(off).width).toBe(28));
		await user.pointer({ keys: '[/MouseLeft]', target: canvasElement });
		await expect(off.getAttribute('aria-checked')).toBe('false');
		await waitFor(() => expect(thumbBox(off)).toMatchObject({ left: 4, width: 24 }));

		// Disabled switches don't stretch.
		const disabled = track('press-disabled');
		await user.pointer({ keys: '[MouseLeft>]', target: disabled });
		await expect(thumbBox(disabled).width).toBe(24);
		await user.pointer({ keys: '[/MouseLeft]', target: disabled });
	}}
>
	<div class="row">
		<span data-case="press-off"><Switch aria-label="Press off" /></span>
		<span data-case="press-on"><Switch checked aria-label="Press on" /></span>
		<span data-case="press-cancel"><Switch aria-label="Press and cancel" /></span>
		<span data-case="press-disabled"><Switch disabled aria-label="Press disabled" /></span>
	</div>
</Story>

<Story
	name="With labels"
	asChild
	play={async ({ canvasElement }) => {
		const notify = canvasElement.querySelector<HTMLElement>('#notifications')!;
		await expect(notify.getAttribute('aria-checked')).toBe('false');

		// Clicking the visible label toggles it.
		await userEvent.click(canvasElement.querySelector('label[for="notifications"]')!);
		await expect(notify.getAttribute('aria-checked')).toBe('true');
		await expect(canvasElement.querySelector('[data-testid="state"]')!.textContent).toContain(
			'notifications: on'
		);

		// The thumb slides across.
		const thumb = notify.querySelector<HTMLElement>('.og-switch-thumb')!;
		await waitFor(() =>
			expect(thumb.getBoundingClientRect().left - notify.getBoundingClientRect().left).toBe(24)
		);

		// Space toggles it from the keyboard.
		notify.focus();
		await userEvent.keyboard(' ');
		await expect(notify.getAttribute('aria-checked')).toBe('false');
		notify.blur();
	}}
>
	<div class="settings">
		<label class="og-label" for="notifications">Notifications</label>
		<Switch id="notifications" bind:checked={settings.notifications} />
		<label class="og-label" for="sync">Sync across devices</label>
		<Switch id="sync" bind:checked={settings.sync} />
	</div>
	<Text variant="caption" as="p" data-testid="state">
		notifications: {settings.notifications ? 'on' : 'off'} · sync: {settings.sync ? 'on' : 'off'}
	</Text>
</Story>

<style>
	.row {
		display: flex;
		gap: 24px;
		align-items: center;
	}
	.settings {
		display: grid;
		grid-template-columns: 200px max-content;
		gap: 12px 16px;
		align-items: center;
		margin-bottom: 16px;
	}
</style>
