import { DEV } from 'esm-env';
import { getContext, setContext } from 'svelte';

/**
 * What a `<FormField>` tells the input placed inside it, so the field's label
 * and description are wired to that input without any ids passed by hand.
 */
export interface FormFieldContext {
	/** The id the input should take, which the field's `<label for>` points at. */
	readonly inputId: string;
	/** The description's id, for `aria-describedby`, when the field has one. */
	readonly descriptionId: string | undefined;
	/** Whether the field is marked required. */
	readonly required: boolean;
	/** Whether the field shows its own icon, in which case the input must not. */
	readonly hasIcon: boolean;
	/**
	 * Called by fixed-width inputs (e.g. the switch) so the label expands to fill
	 * the row instead of sharing it equally with the input.
	 */
	hugInput(): void;
	/** Called by an input that was given its own id, so the label points at that. */
	useInputId(id: () => string | undefined): void;
}

/** What a `<Form>` tracks about its fields, to warn when icons are mixed. */
export interface FormContext {
	/** Registers a field; returns a function that unregisters it. */
	registerField(field: { readonly hasIcon: boolean }): () => void;
}

const FIELD = Symbol('og-form-field');
const GROUP = Symbol('og-form-group');
const FORM = Symbol('og-form');

export function setFormFieldContext(context: FormFieldContext) {
	setContext(FIELD, context);
}

/** The enclosing `<FormField>`, if any. */
export function getFormFieldContext(): FormFieldContext | undefined {
	return getContext<FormFieldContext | undefined>(FIELD);
}

export function setFormGroupContext() {
	setContext(GROUP, true);
	// Content inside a group is no longer inside any outer field.
	setContext(FIELD, undefined);
}

export function inFormGroup(): boolean {
	return getContext<boolean | undefined>(GROUP) === true;
}

export function setFormContext(context: FormContext) {
	setContext(FORM, context);
}

export function getFormContext(): FormContext | undefined {
	return getContext<FormContext | undefined>(FORM);
}

/**
 * Connects an Oganesson input to the `<FormField>` around it, if any: the field's
 * label then points at the input's own `id` (or the field generates one). In
 * development, warns when both the field and the input have an icon.
 */
export function connectFormField(
	component: string,
	options: { id: () => string | undefined; icon?: () => unknown; hug?: boolean }
): FormFieldContext | undefined {
	const field = getFormFieldContext();
	if (!field) return undefined;
	field.useInputId(options.id);
	if (options.hug) field.hugInput();
	if (DEV && field.hasIcon && options.icon?.()) {
		console.warn(
			`[oganesson] <${component}> inside a <FormField> with an icon must not have its own icon (Forms.md).`
		);
	}
	return field;
}

/** Joins space-separated id lists, dropping empty parts. */
export function joinIds(...ids: (string | null | undefined)[]): string | undefined {
	const joined = ids.filter(Boolean).join(' ');
	return joined || undefined;
}
