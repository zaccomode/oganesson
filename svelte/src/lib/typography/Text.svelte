<!--
@component
Text in one of Oganesson's text styles (design/Core/Typography.md).

```svelte
<Text variant="title">Account settings</Text>
<Text variant="subtitle" as="span">3 items</Text>
```

Each variant renders a sensible element by default (titles are headings,
everything else a paragraph); change it with `as`. Only use one `title`
heading per page or modal.
-->
<script lang="ts" module>
	import type { TextVariant } from '../tokens.js';

	const defaultElement: Record<TextVariant, string> = {
		'large-title': 'h1',
		title: 'h1',
		'title-2': 'h2',
		label: 'p',
		'small-label': 'p',
		subtitle: 'p',
		caption: 'p'
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		variant?: TextVariant;
		/** The element to render. Defaults by variant. */
		as?: string;
		children?: Snippet;
	}

	let { variant = 'label', as, class: className, children, ...rest }: Props = $props();
</script>

<svelte:element this={as ?? defaultElement[variant]} {...rest} class={[`og-${variant}`, className]}>
	{@render children?.()}
</svelte:element>
