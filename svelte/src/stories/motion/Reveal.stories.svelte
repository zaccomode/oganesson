<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, waitFor } from 'storybook/test';
	import { Form, FormField, FormGroup, Reveal, Switch, Text, TextInput } from '#lib';
	import { motion } from '#lib/tokens.js';

	const { Story } = defineMeta({
		title: 'Motion/Reveal',
		component: Reveal,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Reveal motion (Animations.md): shows its content while `when` is true, animating it in and out. The content fades, sharpens from a 4px blur and grows from 95% scale while its height opens up, so what follows slides instead of jumping: 200ms in, 150ms out, from the `--og-*-reveal-*` tokens. Use it for content that appears or disappears within its parent, such as a field that only applies while a switch is on. For a custom wrapper, use the `reveal` transition as `in:reveal out:reveal`.'
				}
			}
		}
	});

	const profile = $state({ useNickname: false, nickname: '' });
	let shown = $state(false);

	const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
	const rect = (el: Element) => el.getBoundingClientRect();

	/**
	 * Waits for the reveal animation on `el` to run for `duration` (Svelte starts
	 * it just after inserting the element, after a placeholder for its 0ms delay),
	 * then for it to finish. Under reduced motion there's nothing to wait for.
	 */
	async function animates(el: Element, duration: number) {
		if (reduced()) return;
		const animation = await waitFor(() => started(el));
		await expect(animation.effect!.getTiming().duration).toBe(duration);
		await animation.finished;
	}

	/** The reveal animation running on `el`; throws (for `waitFor`) until it starts. */
	function started(el: Element) {
		const running = el.getAnimations().find((a) => Number(a.effect!.getTiming().duration) > 0);
		if (!running) throw new Error('The reveal animation has not started');
		return running;
	}
</script>

<Story
	name="Conditional field"
	asChild
	play={async ({ canvasElement }) => {
		const body = canvasElement.querySelector<HTMLElement>('.og-form-group-body')!;
		const toggle = canvasElement.querySelector<HTMLElement>('[role="switch"]')!;
		const after = canvasElement.querySelector<HTMLElement>('[data-testid="after"]')!;
		const wrapper = () => canvasElement.querySelector<HTMLElement>('[data-testid="nickname"]');
		const startTop = rect(after).top;

		await expect(wrapper()).toBeNull();

		// Turning the switch on reveals the field over 200ms.
		await userEvent.click(toggle);
		await waitFor(() => expect(wrapper()).not.toBeNull());
		await animates(wrapper()!, motion.revealInMs);

		// Once shown, the wrapper is the group's item: separated from the switch's
		// field by the line, 8px below it.
		const style = getComputedStyle(wrapper()!);
		// Svelte clears the finished animation, so no filter lingers to cut any
		// acrylic inside the content off from the page behind it.
		await waitFor(() => expect(style.filter).toBe('none'));
		await expect(wrapper()!.parentElement).toBe(body);
		await expect(style.borderTopWidth).toBe('1px');
		await expect(style.paddingTop).toBe('8px');
		await expect(style.opacity).toBe('1');
		await expect(style.scale).toBe('none');
		const shownTop = rect(after).top;
		const shownHeight = style.height;
		await expect(shownTop).toBeGreaterThan(startTop);

		// Turning it off hides the field over 150ms, then removes it; the group
		// closes back up to where it started, gap included.
		const leaving = wrapper()!;
		await userEvent.click(toggle);
		await animates(leaving, motion.revealOutMs);
		await waitFor(() => expect(wrapper()).toBeNull());
		await expect(rect(after).top).toBe(startTop);

		// Flipped back partway through, it turns around from where it is and
		// still opens to its full height, rather than to where it was and jumping.
		if (reduced()) return;
		await userEvent.click(toggle);
		await waitFor(() => expect(wrapper()).not.toBeNull());
		await new Promise((r) => setTimeout(r, motion.revealInMs / 2));
		await userEvent.click(toggle);
		await new Promise((r) => setTimeout(r, motion.revealOutMs / 3));
		await userEvent.click(toggle);
		const reversed = await waitFor(() => started(wrapper()!));
		const frames = (reversed.effect as KeyframeEffect).getKeyframes();
		await expect(frames.at(-1)!.height).toBe(shownHeight);
		await reversed.finished;
		await waitFor(() => expect(rect(after).top).toBe(shownTop));
	}}
>
	<div class="form-500">
		<Form>
			<FormGroup>
				<FormField label="Use a nickname">
					<Switch bind:checked={profile.useNickname} />
				</FormField>
				<Reveal when={profile.useNickname} data-testid="nickname">
					<FormField label="Nickname" description="Shown instead of your name.">
						<TextInput bind:value={profile.nickname} placeholder="Jane..." />
					</FormField>
				</Reveal>
			</FormGroup>
			<FormGroup data-testid="after">
				<FormField label="Display name">
					<TextInput placeholder="Jane Doe..." />
				</FormField>
			</FormGroup>
		</Form>
	</div>
</Story>

<Story
	name="In a flex column"
	asChild
	play={async ({ canvasElement }) => {
		const below = canvasElement.querySelector<HTMLElement>('[data-testid="below"]')!;
		const startTop = rect(below).top;
		const button = canvasElement.querySelector<HTMLButtonElement>('button')!;

		// Shown, the content and its 16px gap push the paragraph below down.
		await userEvent.click(button);
		const content = await waitFor(() => {
			const el = canvasElement.querySelector<HTMLElement>('[data-testid="content"]');
			if (!el) throw new Error('The content has not appeared');
			return el;
		});
		await animates(content, motion.revealInMs);
		await expect(rect(below).top).toBe(startTop + rect(content).height + 16);

		// Hidden, the gap closes too, so nothing is left behind.
		await userEvent.click(button);
		await animates(content, motion.revealOutMs);
		await waitFor(() => expect(canvasElement.querySelector('[data-testid="content"]')).toBeNull());
		await expect(rect(below).top).toBe(startTop);
	}}
>
	<div class="column">
		<button type="button" onclick={() => (shown = !shown)}>{shown ? 'Hide' : 'Show'}</button>
		<Text as="p">Content above. Siblings are 16px apart.</Text>
		<Reveal when={shown} class="card" data-testid="content">
			<Text as="p">
				Revealed content. Its height, padding and the gap before it open up as it appears.
			</Text>
		</Reveal>
		<Text as="p" data-testid="below">Content below, which slides rather than jumps.</Text>
	</div>
</Story>

<style>
	.form-500 {
		width: 500px;
	}
	.column {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		width: 400px;
	}
	.column :global(p) {
		margin: 0;
	}
	.column :global(.card) {
		padding: 16px;
		border-radius: 16px;
		background: var(--og-bg-acrylic);
	}
</style>
