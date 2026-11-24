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
