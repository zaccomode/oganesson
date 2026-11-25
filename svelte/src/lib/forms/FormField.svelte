<!--
@component
A labelled input in a form (design/Forms/Forms.md: Fields). Place it inside a
`<FormGroup>`.

The label (required) and optional description sit to the left of the input and
move above it when the field is narrower than 400px, such as in a narrow sheet
or on a phone. Text inputs and selects share the row equally with the label;
fixed-width inputs like a switch stay at the right and the label fills the rest.
Required fields show a red asterisk after the label.

The field wires its label and description to the Oganesson input inside it. For
any other control, take the props from the children snippet:

```svelte
<FormField label="Name" required>
	<TextInput bind:value={name} placeholder="Jane Doe..." />
</FormField>

<FormField label="Colour" description="Used for the calendar.">
	{#snippet children(props)}<input type="color" {...props} />{/snippet}
</FormField>
```

An optional `icon` identifies the field; the input inside must then have no icon
of its own. Within a form, either every field has an icon or none does.
-->
<script lang="ts" module>
	/** Props for a custom control inside a `<FormField>`, wiring it to the field's label. */
	export interface FormFieldControlProps {
		id: string;
		'aria-describedby': string | undefined;
		required: boolean | undefined;
	}
</script>

<script lang="ts">
	import { DEV } from 'esm-env';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Icon from '../icons/Icon.svelte';
	import type { IconComponent } from '../buttons/types.js';
	import { getFormContext, inFormGroup, setFormFieldContext } from './context.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
		/** The field's label. Always required. */
		label: string;
		/** Further detail, where the label and placeholder alone don't explain the field. */
		description?: string | Snippet;
		/** Marks the field required: a red asterisk after the label, and `required` on the input. */
		required?: boolean;
		/** Identifies the field. The input inside must then have no icon. */
		icon?: IconComponent;
		/**
		 * How the input shares the row: `equal` halves (text inputs, selects) or
		 * `hug` (fixed-width inputs, with the label filling the rest). Oganesson's
		 * switch sets `hug` itself; set it for other fixed-width controls.
		 */
		inputWidth?: 'equal' | 'hug';
		/** The input's id. Defaults to the Oganesson input's own `id`, or a generated one. */
		inputId?: string;
		/** The input. Receives the props that wire a custom control to the label. */
		children: Snippet<[FormFieldControlProps]>;
	}

	let {
		label,
		description,
		required = false,
		icon,
		inputWidth,
		inputId,
		children,
		class: className,
		...rest
	}: Props = $props();

	const uid = $props.id();
	let controlId = $state<() => string | undefined>();
	const id = $derived(inputId ?? controlId?.() ?? `${uid}-input`);
	const descriptionId = $derived(description ? `${uid}-description` : undefined);

	let inputHugs = $state(false);
	const hug = $derived(inputWidth ? inputWidth === 'hug' : inputHugs);

	setFormFieldContext({
		get inputId() {
			return id;
		},
		get descriptionId() {
			return descriptionId;
		},
		get required() {
			return required;
		},
		get hasIcon() {
			return icon !== undefined;
		},
		hugInput() {
			inputHugs = true;
		},
		useInputId(getId) {
			controlId = getId;
		}
	});

	const form = getFormContext();
	$effect(() =>
		form?.registerField({
			get hasIcon() {
				return icon !== undefined;
			}
		})
	);

	if (DEV && !inFormGroup()) {
		console.warn('[oganesson] <FormField> must be inside a <FormGroup> (Forms.md).');
	}

	const controlProps: FormFieldControlProps = $derived({
		id,
		'aria-describedby': descriptionId,
		required: required || undefined
	});
</script>

<div {...rest} class={['og-form-field', className]}>
	<div
		class="og-form-field-layout"
		data-icon={icon ? '' : undefined}
		data-description={description ? '' : undefined}
		data-hug={hug ? '' : undefined}
	>
		{#if icon}
			<span class="og-form-field-icon"><Icon {icon} /></span>
		{/if}
		<div class="og-form-field-text">
			<div class="og-form-field-label-row">
				<label class="og-label og-form-field-label" for={id}>{label}</label>
				{#if required}
					<span class="og-label og-form-field-required" aria-hidden="true">*</span>
				{/if}
			</div>
			{#if typeof description === 'string'}
				<p id={descriptionId} class="og-small-label og-form-field-description">{description}</p>
			{:else if description}
				<div id={descriptionId} class="og-small-label og-form-field-description">
					{@render description()}
				</div>
			{/if}
		</div>
		<div class="og-form-field-input">
			{@render children(controlProps)}
		</div>
	</div>
</div>

<style>
	/* Fields respond to their own width, so they adapt inside narrow sheets too. */
	.og-form-field {
		container-type: inline-size;
		min-width: 0;
	}

	/*
	 * Forms-Form Field.sketchframe: a row with 4px left padding and 8px gaps.
	 * The label column and the input share the row equally; an icon takes 16px
	 * before the label.
	 */
	.og-form-field-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		grid-template-areas: 'text input';
		align-items: center;
		gap: 8px;
		padding-left: 4px;
	}

	.og-form-field-layout[data-icon] {
		grid-template-columns: 16px minmax(0, 1fr) minmax(0, 1fr);
		grid-template-areas: 'icon text input';
	}

	/* Fixed-width inputs (e.g. a switch): the label fills the rest of the row. */
	.og-form-field-layout[data-hug] {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.og-form-field-layout[data-icon][data-hug] {
		grid-template-columns: 16px minmax(0, 1fr) auto;
	}

	/* With a description the row aligns to the top: the label sits 4px down and the
	   icon 5px, lining both up with the input's text. */
	.og-form-field-layout[data-description] {
		align-items: start;
	}

	.og-form-field-layout[data-description] > .og-form-field-text {
		padding-top: 4px;
	}

	.og-form-field-layout[data-description] > .og-form-field-icon {
		padding-top: 5px;
	}

	.og-form-field-icon {
		grid-area: icon;
		display: flex;
		color: var(--og-color-dark);
	}

	.og-form-field-text {
		grid-area: text;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.og-form-field-label-row {
		display: flex;
		gap: 2px;
		align-items: flex-start;
	}

	.og-form-field-label {
		color: var(--og-color-dark);
		overflow-wrap: anywhere;
	}

	.og-form-field-required {
		color: var(--og-color-danger);
	}

	.og-form-field-description {
		margin: 0;
	}

	.og-form-field-input {
		grid-area: input;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.og-form-field-layout[data-hug] > .og-form-field-input {
		align-items: flex-end;
	}

	/* Thin fields: the label and description move above the input, which takes the
	   full width. Fixed-width inputs stay beside their label. */
	@container (max-width: 399px) {
		.og-form-field-layout:not([data-hug]) {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: 'text' 'input';
			align-items: start;
		}

		.og-form-field-layout[data-icon]:not([data-hug]) {
			grid-template-columns: 16px minmax(0, 1fr);
			grid-template-areas: 'icon text' 'input input';
		}

		.og-form-field-layout:not([data-hug]) > .og-form-field-text {
			padding-top: 0;
		}

		/* Centre the icon on the label's first line. */
		.og-form-field-layout:not([data-hug]) > .og-form-field-icon {
			padding-top: 1px;
		}

		.og-form-field-layout:not([data-hug]) > .og-form-field-input {
			margin-left: -4px;
		}
	}
</style>
