<!--
  Stand-in for a non-Lucide icon library: a fill-based icon on a 256-unit
  viewBox with its own default size, like Phosphor's components.
-->
<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	let { size = 32, ...rest }: SVGAttributes<SVGSVGElement> & { size?: number } = $props();
</script>

<svg
	{...rest}
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 256 256"
	fill="currentColor"
>
	<path
		d="M234.5 114.38l-45.1 39.36 13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54-45.11-39.42a16 16 0 0 1 9.11-28.06l59.46-5.15 23.21-55.36a15.95 15.95 0 0 1 29.44 0l23.28 55.36 59.44 5.15a16 16 0 0 1 9.11 28.06Z"
	/>
</svg>
