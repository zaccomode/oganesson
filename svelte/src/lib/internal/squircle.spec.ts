import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { elevatedEffects, resolveRadius } from './squircle.svelte';

describe('resolveRadius', () => {
	it('uses the computed CSS radius by default', () => {
		expect(resolveRadius(undefined, '8px')).toBe(8);
		expect(resolveRadius(undefined, '12.5px')).toBe(12.5);
	});

	it('prefers an explicit radius', () => {
		expect(resolveRadius(16, '8px')).toBe(16);
	});

	it('leaves radii under 8px to plain CSS', () => {
		expect(resolveRadius(undefined, '6px')).toBeNull();
		expect(resolveRadius(4, '8px')).toBeNull();
		expect(resolveRadius(undefined, '0px')).toBeNull();
	});

	it('ignores values it cannot parse', () => {
		expect(resolveRadius(undefined, '')).toBeNull();
		expect(resolveRadius(undefined, 'auto')).toBeNull();
	});
});

describe('elevatedEffects', () => {
	const lib = new URL('../', import.meta.url);
	const sources = readdirSync(lib, { recursive: true, encoding: 'utf8' }).filter((file) =>
		/\.(svelte|ts)$/.test(file)
	);

	it('is the white Acrylic (Elevated) highlight', () => {
		expect(elevatedEffects.innerShadow).toEqual({
			offsetX: 0,
			offsetY: 1,
			blur: 6,
			spread: 0,
			color: '#ffffff',
			opacity: 1
		});
	});

	it('is the only inner shadow defined in the library', () => {
		const definers = sources
			.map((file) => file.replaceAll('\\', '/'))
			.filter((file) => /innerShadow\s*:/.test(readFileSync(new URL(file, lib), 'utf8')));
		expect(definers).toEqual(['internal/squircle.svelte.ts']);
	});
});
