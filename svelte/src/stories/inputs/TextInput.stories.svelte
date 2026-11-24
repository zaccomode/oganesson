<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, waitFor } from 'storybook/test';
	import { Search } from '@lucide/svelte';
	import { Text, TextInput } from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Inputs/TextInput',
		component: TextInput,
		tags: ['autodocs'],
		argTypes: {
			appearance: { control: 'inline-radio', options: ['default', 'subtle'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Single-line text input (Inputs.md). **Default** sits on thin glass; **subtle** has no background, for inputs inside contained areas such as toolbars. An optional left icon explains a field that stands alone. Placeholders end in an ellipsis: an example value next to a visible label, an action when there is none.'
				}
			}
		}
	});

	const typing = $state({ value: '' });

	const ringOpacity = (root: Element) =>
		getComputedStyle(root.querySelector('.og-focus-ring')!).opacity;
</script>

<Story name="Playground" args={{ appearance: 'default', placeholder: 'Write something...' }}>
	{#snippet template(args)}
		<div class="field">
			<TextInput {...args} icon={Search} aria-label="Playground" />
		</div>
	{/snippet}
</Story>

<Story
	name="Styles"
	asChild
	play={async ({ canvasElement }) => {
		const field = (c: string) =>
			canvasElement.querySelector<HTMLElement>(`[data-case="${c}"] .og-text-input-field`)!;
		const root = (c: string) =>
			canvasElement.querySelector<HTMLElement>(`[data-case="${c}"] .og-text-input`)!;

		await expect(field('default-icon').getBoundingClientRect().height).toBe(28);
		await expect(getComputedStyle(field('default-icon')).paddingLeft).toBe('8px');
		await expect(getComputedStyle(field('default')).padding).toBe('6px 10px');
		await expect(
			sameColor(getComputedStyle(field('default')).backgroundColor, colors['dark-thin-glass'])
		).toBe(true);
		await expect(getComputedStyle(field('subtle')).backgroundColor).toBe('rgba(0, 0, 0, 0)');

		// Icon: 12px, secondary at rest, dark while focused.
		const icon = field('default-icon').querySelector<HTMLElement>('.og-icon')!;
		await expect(icon.getBoundingClientRect().width).toBe(12);
		await expect(sameColor(getComputedStyle(icon).color, colors['dark-secondary'])).toBe(true);

		const input = field('default-icon').querySelector('input')!;
		await expect(
			sameColor(getComputedStyle(input, '::placeholder').color, colors['dark-secondary'])
		).toBe(true);

		// Focus shows the focus border, with the inner line only on the default style.
		await expect(ringOpacity(root('default-icon'))).toBe('0');
		await userEvent.click(input);
		await expect(ringOpacity(root('default-icon'))).toBe('1');
		await expect(getComputedStyle(icon).color).toBe('rgb(33, 37, 43)');
		await expect(root('default-icon').querySelector('.og-focus-ring-inner')).not.toBeNull();
		await expect(root('subtle-icon').querySelector('.og-focus-ring-inner')).toBeNull();

		// Clicking the padding focuses the input.
		const subtle = field('subtle');
		const box = subtle.getBoundingClientRect();
		await userEvent.pointer({
			keys: '[MouseLeft]',
			target: subtle,
			coords: { clientX: box.right - 3, clientY: box.top + 3 }
		});
		await waitFor(() => expect(document.activeElement).toBe(subtle.querySelector('input')));
		subtle.querySelector('input')!.blur();
	}}
>
	<div class="grid">
		<Text variant="caption" as="span"></Text>
		<Text variant="caption" as="span">Icon</Text>
		<Text variant="caption" as="span">No icon</Text>
		{#each ['default', 'subtle'] as const as appearance (appearance)}
			<Text variant="caption" as="span">{appearance}</Text>
			<div class="field" data-case="{appearance}-icon">
				<TextInput
					{appearance}
					icon={Search}
					placeholder="Write something..."
					aria-label="{appearance} with icon"
				/>
			</div>
			<div class="field" data-case={appearance}>
				<TextInput {appearance} placeholder="Write something..." aria-label={appearance} />
			</div>
		{/each}
	</div>
</Story>

<Story
	name="Typing"
	asChild
	play={async ({ canvasElement }) => {
		const input = canvasElement.querySelector<HTMLInputElement>('input')!;
		await userEvent.type(input, 'Ada Lovelace');
		await expect(canvasElement.querySelector('[data-testid="echo"]')!.textContent).toBe(
			'Ada Lovelace'
		);
		await expect(getComputedStyle(input).color).toBe('rgb(33, 37, 43)');
		await expect(getComputedStyle(input).fontSize).toBe('13px');
		input.blur();
	}}
>
	<div class="field">
		<TextInput bind:value={typing.value} placeholder="John Doe..." aria-label="Name" />
		<Text variant="caption" as="p" data-testid="echo">{typing.value}</Text>
	</div>
</Story>

<Story
	name="Disabled"
	asChild
	play={async ({ canvasElement }) => {
		const input = canvasElement.querySelector<HTMLInputElement>('input')!;
		await expect(input.disabled).toBe(true);
		await expect(sameColor(getComputedStyle(input).color, colors['dark-secondary'])).toBe(true);
	}}
>
	<div class="field">
		<TextInput value="Read only value" disabled icon={Search} aria-label="Disabled" />
	</div>
</Story>

<style>
	.grid {
		display: grid;
		grid-template-columns: max-content 180px 180px;
		gap: 20px;
		align-items: center;
	}
	.field {
		width: 180px;
	}
</style>
