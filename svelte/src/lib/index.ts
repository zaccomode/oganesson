import './styles/index.css';

export { default as Text } from './typography/Text.svelte';
export { default as Icon } from './icons/Icon.svelte';
export {
	setOganessonIcons,
	getOganessonIcons,
	defaultIcons,
	type OganessonIcons
} from './icons/context.js';
export { squircle, type SquircleOptions } from './internal/squircle.svelte.js';
export * as tokens from './tokens.js';
export type { ColorToken, TextVariant } from './tokens.js';
