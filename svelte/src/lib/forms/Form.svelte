<!--
@component
A form (design/Forms/Forms.md): a column of `<FormGroup>`s holding fields and
buttons. Forms are for entering or editing medium-to-large amounts of
information; short flows like signing in usually don't need one.

The form fills its container between 300px and 650px wide. Every field and
button must sit inside a group. Within a form, either every field has an icon or
none does; in development, mixing them logs a warning.

```svelte
<Form onsubmit={save}>
	<FormGroup>
		<FormField label="Name"><TextInput bind:value={name} placeholder="Jane Doe..." /></FormField>
	</FormGroup>
	<FormGroup title="Notifications">
		<FormField label="Email updates"><Switch bind:checked={email} /></FormField>
	</FormGroup>
</Form>
```
-->
<script lang="ts">
	import { DEV } from 'esm-env';
	import { untrack, type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { setFormContext } from './context.js';

	interface Props extends HTMLFormAttributes {
		/** The form's groups. */
		children: Snippet;
		/** The `<form>` element. */
		ref?: HTMLFormElement | null;
	}

	let { children, ref = $bindable(null), class: className, ...rest }: Props = $props();

	const fields = $state<{ readonly hasIcon: boolean }[]>([]);

	setFormContext({
		registerField(field) {
			// Fields register from their own effects; don't make those depend on the list.
			untrack(() => fields.push(field));
			return () =>
				untrack(() => {
					const index = fields.indexOf(field);
					if (index !== -1) fields.splice(index, 1);
				});
		}
	});

	if (DEV) {
		$effect(() => {
			const withIcon = fields.filter((field) => field.hasIcon).length;
			if (withIcon > 0 && withIcon < fields.length) {
				console.warn(
					`[oganesson] <Form>: ${withIcon} of ${fields.length} fields have an icon. ` +
						'Within a form, give every field an icon or none (Forms.md).'
				);
			}
		});
	}
</script>

<form bind:this={ref} {...rest} class={['og-form', className]}>
	{@render children()}
</form>

<style>
	/* Form Exploration.sketchframe: groups stacked 16px apart; forms are 300–650px wide. */
	.og-form {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
		min-width: 300px;
		max-width: 650px;
		margin: 0;
	}
</style>
