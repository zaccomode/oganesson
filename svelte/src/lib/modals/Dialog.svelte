<!--
@component
A dialog modal (design/Modals/Modals.md): a small, direct alert or confirmation,
most often before a destructive or major action. It needs a title of 3-5 words
that explains the whole purpose ("Confirm account deletion") and a short, 1-2
sentence description of what happens next.

The cancel action sits on the left and the prominent confirm action on the right.
The cancel action has focus when the dialog opens; Tab or the arrow keys move to
confirm. Pressing the background, Escape, the close button or the cancel action
all close the dialog and fire `onCancel`. Confirming fires `onConfirm` and closes
it (return `false` to keep it open). Turn off closing from the background with
`closeOnBackgroundPress={false}`; Escape follows it unless `closeOnEscape` is set.

Open it from a `trigger` snippet (spread `props` onto your button), or bind `open`:

```svelte
<Dialog
	title="Confirm account deletion"
	description="Your projects and settings will be removed. This can't be undone."
	cancelLabel="Nevermind"
	confirmLabel="Delete"
	confirmIcon={Trash2}
	onConfirm={deleteAccount}
>
	{#snippet trigger({ props })}
		<Button {...props} colorway="danger">Delete account</Button>
	{/snippet}
</Dialog>
```
-->
<script lang="ts">
	import { AlertDialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import Button from '../buttons/Button.svelte';
	import IconButton from '../buttons/IconButton.svelte';
	import type { IconComponent } from '../buttons/types.js';
	import { getOganessonIcons } from '../icons/context.js';
	import { elevatedEffects, squircle } from '../internal/squircle.svelte.js';
	import Text from '../typography/Text.svelte';
	import { DIALOG_WIDTH, moveBetweenActions } from './modal.js';

	interface Props {
		/** 3-5 words that explain the dialog's whole purpose. */
		title: string;
		/** A short, 1-2 sentence explanation of what the action does. */
		description: string;
		/** The primary (confirm) action, on the right. */
		confirmLabel?: string;
		/** An icon beside the confirm label. */
		confirmIcon?: IconComponent;
		/** The secondary (cancel) action, on the left. `false` leaves it out. */
		cancelLabel?: string | false;
		/** Show the close button in the top right. */
		closeButton?: boolean;
		/** Whether the dialog is open. */
		open?: boolean;
		/** The control that opens the dialog. Spread `props` onto it. */
		trigger?: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
		/**
		 * Pressing the background closes the dialog as a cancellation. Turn it off when
		 * there's no default cancellation, or when cancelling has consequences.
		 */
		closeOnBackgroundPress?: boolean;
		/** Escape closes the dialog as a cancellation. Follows `closeOnBackgroundPress` by default. */
		closeOnEscape?: boolean;
		/** The confirm action was chosen. Return `false` to keep the dialog open. */
		onConfirm?: () => void | boolean;
		/** The dialog closed without confirming: cancel, close, background press or Escape. */
		onCancel?: () => void;
		onOpenChange?: (open: boolean) => void;
		class?: ClassValue;
	}

	let {
		title,
		description,
		confirmLabel = 'Confirm',
		confirmIcon,
		cancelLabel = 'Cancel',
		closeButton = true,
		open = $bindable(false),
		trigger,
		closeOnBackgroundPress = true,
		closeOnEscape,
		onConfirm,
		onCancel,
		onOpenChange,
		class: className
	}: Props = $props();

	const icons = getOganessonIcons();

	let cancelButton = $state<HTMLElement | null>(null);
	let confirmButton = $state<HTMLElement | null>(null);
	let actions = $state<HTMLElement | null>(null);

	// bits only calls this for changes it makes itself: the trigger, Escape, a background
	// press and the Cancel/close buttons. Every close it reports is a cancellation;
	// confirming closes through `confirm()` below, which bits never reports.
	function handleOpenChange(next: boolean) {
		onOpenChange?.(next);
		if (!next) onCancel?.();
	}

	// AlertDialog.Action doesn't close on its own, so this is the only path that closes
	// on confirm, and returning `false` from `onConfirm` leaves the dialog open.
	function confirm() {
		if (onConfirm?.() === false) return;
		open = false;
		onOpenChange?.(false);
	}
</script>

<AlertDialog.Root bind:open onOpenChange={handleOpenChange}>
	{#if trigger}
		<AlertDialog.Trigger>
			{#snippet child({ props })}
				{@render trigger({ props, open })}
			{/snippet}
		</AlertDialog.Trigger>
	{/if}
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="og-modal-overlay" data-og-modal="dialog" />
		<AlertDialog.Content
			class={['og-modal', 'og-dialog', className]}
			style="--og-dialog-width: {DIALOG_WIDTH}px"
			interactOutsideBehavior={closeOnBackgroundPress ? 'close' : 'ignore'}
			escapeKeydownBehavior={(closeOnEscape ?? closeOnBackgroundPress) ? 'close' : 'ignore'}
			onOpenAutoFocus={(event) => {
				// Modals.md: the cancellation action has focus by default.
				event.preventDefault();
				(cancelButton ?? confirmButton)?.focus();
			}}
		>
			<div
				class="og-modal-surface og-dialog-surface"
				{@attach squircle({ radius: 22, effects: elevatedEffects })}
			>
				<div class="og-modal-header">
					<AlertDialog.Title>
						{#snippet child({ props })}
							<Text {...props} variant="title" as="h2" class="og-modal-title">{title}</Text>
						{/snippet}
					</AlertDialog.Title>
					{#if closeButton}
						<AlertDialog.Cancel>
							{#snippet child({ props })}
								<IconButton {...props} icon={icons.close} label="Close" tooltip={false} />
							{/snippet}
						</AlertDialog.Cancel>
					{/if}
				</div>
				<AlertDialog.Description>
					{#snippet child({ props })}
						<Text {...props} variant="label" class="og-dialog-description">{description}</Text>
					{/snippet}
				</AlertDialog.Description>
				<!-- Arrow keys move between the actions; Tab works as usual (Modals.md). -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<div
					class="og-dialog-actions"
					bind:this={actions}
					role="group"
					aria-label="Actions"
					onkeydown={(event) => actions && moveBetweenActions(event, actions)}
				>
					{#if cancelLabel !== false}
						<AlertDialog.Cancel>
							{#snippet child({ props })}
								<Button {...props} bind:ref={cancelButton}>{cancelLabel}</Button>
							{/snippet}
						</AlertDialog.Cancel>
					{/if}
					<AlertDialog.Action>
						{#snippet child({ props })}
							<Button
								{...props}
								bind:ref={confirmButton}
								appearance="prominent"
								icon={confirmIcon}
								onclick={confirm}
							>
								{confirmLabel}
							</Button>
						{/snippet}
					</AlertDialog.Action>
				</div>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>

<style>
	/* Portalled, hence :global. Shared modal styles are in styles/modal.css. */
	:global(.og-dialog) {
		width: var(--og-dialog-width);
		max-width: calc(100vw - 32px);
		height: fit-content;
		max-height: calc(100dvh - 32px);
	}

	/* Dialog Modal.sketchframe: Acrylic (Elevated) with 16px padding, 16px between
	   the header, the description and the actions. */
	:global(.og-dialog-surface) {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 16px;
		overflow: auto;
		background: var(--og-bg-acrylic);
		-webkit-backdrop-filter: blur(var(--og-blur-menu));
		backdrop-filter: blur(var(--og-blur-menu));
	}

	:global(.og-dialog-description) {
		margin: 0;
	}

	/* Cancel on the left, confirm on the right, 8px apart, at the end of the row. */
	:global(.og-dialog-actions) {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 8px;
	}
</style>
