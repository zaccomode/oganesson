<!--
@component
An Oganesson tooltip (Buttons-Icon Button sketchframes): a small Acrylic pill
with caption text, 2px from its trigger, above by default and flipping when
there isn't room.

Render the trigger through the `trigger` snippet and spread `props` onto it:

```svelte
<Tooltip text="Delete">
	{#snippet trigger(props)}<button {...props}>…</button>{/snippet}
</Tooltip>
```
-->
<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { ButtonColorway } from '../buttons/types.js';
	import { hasTooltipProvider, TOOLTIP_DELAY, TOOLTIP_SKIP_DELAY } from './context.js';

	interface Props {
		text: string;
		/** Preferred side; flips automatically when there isn't room. */
		side?: 'top' | 'bottom';
		/** Open immediately instead of after the hover delay. */
		instant?: boolean;
		disabled?: boolean;
		/** Text colour follows the trigger's colourway. */
		colorway?: ButtonColorway;
		trigger: Snippet<[Record<string, unknown>]>;
	}

	let {
		text,
		side = 'top',
		instant = false,
		disabled = false,
		colorway,
		trigger
	}: Props = $props();

	const standalone = !hasTooltipProvider();
</script>

{#snippet root()}
	<Tooltip.Root delayDuration={instant ? 0 : undefined} {disabled}>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				{@render trigger(props)}
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content
				{side}
				sideOffset={2}
				collisionPadding={8}
				class="og-tooltip og-caption"
				data-colorway={colorway ?? 'dark'}
			>
				{text}
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
{/snippet}

{#if standalone}
	<Tooltip.Provider
		delayDuration={TOOLTIP_DELAY}
		skipDelayDuration={TOOLTIP_SKIP_DELAY}
		disableHoverableContent
	>
		{@render root()}
	</Tooltip.Provider>
{:else}
	{@render root()}
{/if}

<style>
	/* Content is portalled out of this component, hence :global. */
	:global(.og-tooltip) {
		z-index: 1000;
		padding: 2px 6px;
		border-radius: 999px;
		background: var(--og-bg-acrylic);
		-webkit-backdrop-filter: blur(var(--og-blur-menu));
		backdrop-filter: blur(var(--og-blur-menu));
		box-shadow: var(--og-shadow-elevated), var(--og-acrylic-highlight);
		white-space: nowrap;
		pointer-events: none;
	}

	:global(.og-tooltip[data-colorway='dark']) {
		color: var(--og-color-dark-secondary);
	}

	:global(.og-tooltip[data-colorway='primary']) {
		color: var(--og-color-primary-secondary);
	}

	:global(.og-tooltip[data-colorway='danger']) {
		color: var(--og-color-danger-secondary);
	}
</style>
