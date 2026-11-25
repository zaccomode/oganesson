<!--
@component
A sheet modal (design/Modals/Modals.md): brings focus to a longer flow, usually a
short-to-medium form, or enlarges details from the page beneath. Sheets are
designed to hold an Oganesson `<Form>`.

The sheet has a fixed `width` and `height` (470 × 540 by default). Content
taller than that scrolls beneath the header and footer, which sit on the scroll
edge effect. On a viewport smaller than the sheet, it keeps 16px clear of every
edge.

The footer holds up to three actions, each a snippet given `close`:

- `primaryAction`, on the far right (saving, or moving to the next step);
- `secondaryAction`, just left of it (usually going back a step);
- `tertiaryAction`, on the far left (usually cancelling; call `close`, which
  does the same as the close button).

Leave all three out for static content: the sheet then has no footer. Pressing
the background, Escape, the close button or `close` all fire `onCancel`. Turn
off closing from the background with `closeOnBackgroundPress={false}`; Escape
follows it unless `closeOnEscape` is set.

```svelte
<Sheet title="New event" bind:open>
	<Form id="new-event" onsubmit={save}>…</Form>
	{#snippet tertiaryAction({ close })}
		<Button onclick={close}>Cancel</Button>
	{/snippet}
	{#snippet primaryAction()}
		<Button appearance="prominent" type="submit" form="new-event">Save</Button>
	{/snippet}
</Sheet>
```
-->
<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import IconButton from '../buttons/IconButton.svelte';
	import { getOganessonIcons } from '../icons/context.js';
	import { elevatedEffects, squircle } from '../internal/squircle.svelte.js';
	import ScrollEdgeEffect from '../toolbars/ScrollEdgeEffect.svelte';
	import Text from '../typography/Text.svelte';
	import { firstTabbable, SHEET_VIEWPORT_GAP, type SheetActionArgs } from './modal.js';

	interface Props {
		/** Names the sheet, in its header. */
		title: string;
		/** The sheet's content, usually a `<Form>`. Scrolls when it's taller than the sheet. */
		children: Snippet;
		/** Width in pixels. */
		width?: number;
		/** Height in pixels. */
		height?: number;
		/** The rightmost footer action: save, or the next step. */
		primaryAction?: Snippet<[SheetActionArgs]>;
		/** Just left of the primary action: usually back to the previous step. */
		secondaryAction?: Snippet<[SheetActionArgs]>;
		/** The leftmost footer action: usually cancel. Call `close` from it. */
		tertiaryAction?: Snippet<[SheetActionArgs]>;
		/** Whether the sheet is open. */
		open?: boolean;
		/** The control that opens the sheet. Spread `props` onto it. */
		trigger?: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
		/**
		 * Pressing the background closes the sheet as a cancellation. Turn it off for
		 * forms where losing progress would be irritating.
		 */
		closeOnBackgroundPress?: boolean;
		/** Escape closes the sheet as a cancellation. Follows `closeOnBackgroundPress` by default. */
		closeOnEscape?: boolean;
		/** The sheet closed as a cancellation: close button, `close`, background press or Escape. */
		onCancel?: () => void;
		onOpenChange?: (open: boolean) => void;
		class?: ClassValue;
	}

	let {
		title,
		children,
		width = 470,
		height = 540,
		primaryAction,
		secondaryAction,
		tertiaryAction,
		open = $bindable(false),
		trigger,
		closeOnBackgroundPress = true,
		closeOnEscape,
		onCancel,
		onOpenChange,
		class: className
	}: Props = $props();

	const icons = getOganessonIcons();
	const hasFooter = $derived(Boolean(primaryAction || secondaryAction || tertiaryAction));

	let body = $state<HTMLElement | null>(null);
	let content = $state<HTMLElement | null>(null);

	function handleOpenChange(next: boolean) {
		onOpenChange?.(next);
		if (!next) onCancel?.();
	}

	/** Closes the sheet as a cancellation, like the close button. */
	function close() {
		if (!open) return;
		open = false;
		handleOpenChange(false);
	}

	// Static content that overflows must still scroll from the keyboard: make the
	// body focusable when nothing inside it is.
	function scrollableByKeyboard(node: HTMLElement) {
		const update = () => {
			const overflows = node.scrollHeight > node.clientHeight;
			if (overflows && !firstTabbable(node)) node.tabIndex = 0;
			else node.removeAttribute('tabindex');
		};
		const resize = new ResizeObserver(update);
		resize.observe(node);
		for (const child of node.children) resize.observe(child);
		const mutations = new MutationObserver(update);
		mutations.observe(node, { childList: true, subtree: true });
		update();
		return () => {
			resize.disconnect();
			mutations.disconnect();
		};
	}
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	{#if trigger}
		<Dialog.Trigger>
			{#snippet child({ props })}
				{@render trigger({ props, open })}
			{/snippet}
		</Dialog.Trigger>
	{/if}
	<Dialog.Portal>
		<Dialog.Overlay class="og-modal-overlay" data-og-modal="sheet" />
		<Dialog.Content
			bind:ref={content}
			class={['og-modal', 'og-sheet', className]}
			style="--og-sheet-width: {width}px; --og-sheet-height: {height}px; --og-sheet-gap: {SHEET_VIEWPORT_GAP}px"
			interactOutsideBehavior={closeOnBackgroundPress ? 'close' : 'ignore'}
			escapeKeydownBehavior={(closeOnEscape ?? closeOnBackgroundPress) ? 'close' : 'ignore'}
			onOpenAutoFocus={(event) => {
				// The first control in the content. With none, static content that scrolls
				// takes focus so the keyboard scrolls it; otherwise the sheet itself does.
				const target =
					firstTabbable(body) ?? (body && body.scrollHeight > body.clientHeight ? body : null);
				event.preventDefault();
				if (target && target === body) target.tabIndex = 0;
				(target ?? content)?.focus();
			}}
		>
			<div
				class="og-modal-surface og-sheet-surface"
				data-footer={hasFooter ? '' : undefined}
				{@attach squircle({ radius: 22, effects: elevatedEffects })}
			>
				<ScrollEdgeEffect edge="top" pinned={false} class="og-sheet-header">
					<Dialog.Title>
						{#snippet child({ props })}
							<Text {...props} variant="title" as="h2" class="og-modal-title">{title}</Text>
						{/snippet}
					</Dialog.Title>
					<Dialog.Close>
						{#snippet child({ props })}
							<IconButton {...props} icon={icons.close} label="Close" tooltip={false} />
						{/snippet}
					</Dialog.Close>
				</ScrollEdgeEffect>
				<div class="og-sheet-body" bind:this={body} {@attach scrollableByKeyboard}>
					{@render children()}
				</div>
				{#if hasFooter}
					<ScrollEdgeEffect edge="bottom" pinned={false} class="og-sheet-footer">
						{@render tertiaryAction?.({ close })}
						<span class="og-sheet-spacer"></span>
						{@render secondaryAction?.({ close })}
						{@render primaryAction?.({ close })}
					</ScrollEdgeEffect>
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	/* Portalled, hence :global. Shared modal styles are in styles/modal.css. */

	/* A fixed size, kept 16px clear of the edges of a smaller viewport. */
	:global(.og-sheet) {
		width: var(--og-sheet-width);
		height: var(--og-sheet-height);
		max-width: calc(100vw - 2 * var(--og-sheet-gap));
		max-height: calc(100dvh - 2 * var(--og-sheet-gap));
	}

	/* Sheet Modal.sketchframe: Background 1. The header and footer are 62px bars
	   (16px padding around 30px buttons) laid over the scrolling content. */
	:global(.og-sheet-surface) {
		--og-sheet-bar: 62px;
		position: relative;
		overflow: hidden;
		background: var(--og-bg-1);
	}

	:global(.og-sheet-body) {
		box-sizing: border-box;
		position: absolute;
		inset: 0;
		overflow: auto;
		overscroll-behavior: contain;
		/* Content starts below the header and can scroll to clear the footer. */
		--og-sheet-body-end: 16px;
		padding: var(--og-sheet-bar) 16px var(--og-sheet-body-end);
		/* Scrolling a control into view (Tab, find in page) stops clear of the bars. */
		scroll-padding-block: var(--og-sheet-bar) var(--og-sheet-body-end);
		outline: none;
	}

	:global(.og-sheet-surface[data-footer] .og-sheet-body) {
		--og-sheet-body-end: var(--og-sheet-bar);
	}

	/*
	 * Keep the scrollbar out from under the header and footer. Only WebKit's
	 * scrollbar pseudo-elements can inset the track, and styling them replaces the
	 * system's overlay scrollbar, so this draws a slim one in its style: a 7px
	 * rounded thumb on a clear track, 2px from the edge. Firefox keeps its own.
	 */
	:global(.og-sheet-body::-webkit-scrollbar) {
		width: 11px;
		background: transparent;
	}

	:global(.og-sheet-body::-webkit-scrollbar-track) {
		background: transparent;
		/* Without a footer, still clear the sheet's 22px rounded corner. */
		margin-block: var(--og-sheet-bar) max(var(--og-sheet-body-end), 22px);
	}

	:global(.og-sheet-body::-webkit-scrollbar-thumb) {
		border: 2px solid transparent;
		border-radius: 6px;
		background: var(--og-color-dark-secondary) padding-box;
	}

	/* The header and footer sit on the scroll edge effect (Scroll Edge Effect.md),
	   pinned over the scrolling content. Doubled classes outweigh the effect's own
	   positioning. */
	:global(.og-sheet-surface > .og-sheet-header.og-sheet-header),
	:global(.og-sheet-surface > .og-sheet-footer.og-sheet-footer) {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 1;
		min-height: var(--og-sheet-bar);
	}

	:global(.og-sheet-surface > .og-sheet-header.og-sheet-header) {
		top: 0;
	}

	:global(.og-sheet-surface > .og-sheet-footer.og-sheet-footer) {
		bottom: 0;
	}

	/* Header: the title fills the row, 16px from the close button. Footer: the
	   tertiary action on the far left, then secondary and primary, 8px apart. */
	:global(.og-sheet-header .og-scroll-edge-content) {
		justify-content: flex-start;
		gap: 16px;
	}

	:global(.og-sheet-footer .og-scroll-edge-content) {
		justify-content: flex-start;
	}

	:global(.og-sheet-spacer) {
		flex: 1;
	}
</style>
