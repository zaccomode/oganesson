<!--
@component
A group of related fields in a `<Form>` (design/Forms/Forms.md: Groups), with an
optional short title above it. The first group in a form almost never has a
title: it holds the "general" information.

A group can hold fields, buttons (such as a `<RowButton>`) and display-only
content that helps explain the values of its fields. Every item is separated
from the next by a horizontal line, so put display-only content in a plain
element: the line is drawn as its top border, 8px above its content.

```svelte
<FormGroup title="Schedule">
	<FormField label="All day"><Switch bind:checked={allDay} /></FormField>
	<FormField label="Starts"><TextInput type="datetime-local" bind:value={start} /></FormField>
</FormGroup>
```
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { squircle } from '../internal/squircle.svelte.js';
	import { setFormGroupContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** A short title, a few words long. Names the group for assistive tech too. */
		title?: string;
		/** The group's fields, buttons and display-only content. */
		children: Snippet;
	}

	let { title, children, class: className, ...rest }: Props = $props();

	const uid = $props.id();
	const titleId = `${uid}-title`;

	setFormGroupContext();
</script>

<div
	role={title ? 'group' : undefined}
	aria-labelledby={title ? titleId : undefined}
	{...rest}
	class={['og-form-group', className]}
>
	{#if title}
		<p id={titleId} class="og-subtitle og-form-group-title">{title}</p>
	{/if}
	<div class="og-form-group-body" {@attach squircle()}>
		{@render children()}
	</div>
</div>

<style>
	/* Form Exploration.sketchframe: the title sits 4px above the body. */
	.og-form-group {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	/* Background 2 (Acrylic) with 16px smooth corners, 8px padding, 8px between items. */
	.og-form-group-body {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px;
		border-radius: 16px;
		background-color: var(--og-bg-acrylic);
	}

	/* Every item, buttons included, is separated from the one before by a
	   horizontal line (Dark Thick Glass), 8px from each. */
	.og-form-group-body > :global(* + *) {
		padding-top: 8px;
		border-top: 1px solid var(--og-color-dark-thick-glass);
	}
</style>
