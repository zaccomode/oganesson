<!--
@component
Renders an icon from any SVG icon library (Lucide, Phosphor, Tabler, …) and
sizes and colours it for its context.

The icon fills a box of `--og-icon-size` (14px by default; components set
their own) and draws in the surrounding text colour via `currentColor`, which
nearly every icon library uses.

```svelte
<Icon icon={Trash2} />
<Icon icon={Search} label="Search" size={16} />
<Icon><svg viewBox="0 0 24 24">…</svg></Icon>
```
-->
<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
		/** Any Svelte icon component, e.g. `import { Trash2 } from '@lucide/svelte'`. */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: Component<any>;
		/** Raw SVG markup, as an alternative to `icon`. */
		children?: Snippet;
		/** Accessible name. Without one the icon is decorative and hidden from assistive tech. */
		label?: string;
		/** Overrides `--og-icon-size`. Numbers are px. */
		size?: number | string;
	}

	let {
		icon: IconComponent,
		children,
		label,
		size,
		class: className,
		style,
		...rest
	}: Props = $props();

	const sizeStyle = $derived(
		size === undefined ? '' : `--og-icon-size: ${typeof size === 'number' ? `${size}px` : size};`
	);
</script>

<span
	{...rest}
	class={['og-icon', className]}
	style={[sizeStyle, style].filter(Boolean).join(' ') || undefined}
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
>
	{#if IconComponent}
		<IconComponent aria-hidden="true" />
	{:else}
		{@render children?.()}
	{/if}
</span>

<style>
	.og-icon {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: var(--og-icon-size);
		height: var(--og-icon-size);
		color: inherit;
		line-height: 0;
	}

	.og-icon > :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
