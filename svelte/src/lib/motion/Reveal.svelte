<!--
@component
Shows its content while `when` is true, animating it in and out with the reveal
motion (design/Core/Animations.md: Reveal Motion). Use it for content that
appears or disappears within its parent, such as a field that only applies
while a switch is on:

```svelte
<FormGroup>
	<FormField label="Use a nickname"><Switch bind:checked={useNickname} /></FormField>
	<Reveal when={useNickname}>
		<FormField label="Nickname"><TextInput bind:value={nickname} /></FormField>
	</Reveal>
</FormGroup>
```

The content sits in a plain `<div>`, which takes any other attributes. Inside a
`<FormGroup>` that div is the group's item, so it carries the separator line.

It only animates when `when` changes: content already showing when the page,
or a modal around it, opens or closes doesn't animate on its own. For a custom
wrapper, use the `reveal` transition directly as `in:reveal out:reveal`.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { reveal } from './reveal.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Whether the content shows. */
		when: boolean;
		children: Snippet;
	}

	let { when, children, ...rest }: Props = $props();
</script>

{#if when}
	<div {...rest} in:reveal out:reveal>
		{@render children()}
	</div>
{/if}
