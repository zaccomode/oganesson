<!--
@component
Shares tooltip timing across everything inside it: tooltips open after 500ms,
and once one is open, moving to another within 200ms opens it immediately
(Buttons.md, Icon Variant).

Wrap your app (or a toolbar) in it, e.g. in your root `+layout.svelte`. Icon
buttons outside a provider still show tooltips, but each times its delay on its own.

```svelte
<TooltipProvider>
	{@render children()}
</TooltipProvider>
```
-->
<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { markTooltipProvider, TOOLTIP_DELAY, TOOLTIP_SKIP_DELAY } from './context.js';

	let { children }: { children?: Snippet } = $props();

	markTooltipProvider();
</script>

<Tooltip.Provider
	delayDuration={TOOLTIP_DELAY}
	skipDelayDuration={TOOLTIP_SKIP_DELAY}
	disableHoverableContent
>
	{@render children?.()}
</Tooltip.Provider>
