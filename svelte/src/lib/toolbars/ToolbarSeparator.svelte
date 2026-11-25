<!--
@component
A faint vertical line between sections of a `<ToolbarGroup>` (design/Toolbars.md).

```svelte
<ToolbarGroup>
	<IconButton icon={Undo} label="Undo" />
	<IconButton icon={Redo} label="Redo" />
	<ToolbarSeparator />
	<IconButton icon={Bold} label="Bold" />
</ToolbarGroup>
```
-->
<script lang="ts">
	import { Separator } from 'bits-ui';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props();
</script>

<Separator.Root orientation="vertical" class={['og-toolbar-separator', className]} />

<style>
	/* Toolbars.sketchframe: Toolbar Separator. 1px wide, 16px tall, in dark thick
	   glass, with the group's gap on either side. */
	:global(.og-toolbar-separator) {
		flex: none;
		width: 1px;
		height: 16px;
		background: var(--og-color-dark-thick-glass);
	}
</style>
