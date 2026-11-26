<!--
@component
Internal: cuts its children off from an enclosing `<Toolbar>`. Wrap content that
is portalled out of the toolbar (a modal's surface, a menu's items) so its
buttons keep their own tab stops and arrow keys instead of joining the toolbar's
roving focus, which can't reach them outside its DOM.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setToolbarContext } from '../toolbars/context.js';

	let { children }: { children: Snippet } = $props();

	setToolbarContext(null);
</script>

{@render children()}
