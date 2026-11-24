import { describe, expect, it } from 'vitest';
import { resolveRadius } from './squircle.svelte';

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
