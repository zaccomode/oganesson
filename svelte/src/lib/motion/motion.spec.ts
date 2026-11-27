import { describe, expect, it } from 'vitest';
import { cubicBezier, parseEasing } from './bezier';
import { motion } from '../tokens';
import { readDuration } from './reveal';

describe('cubicBezier', () => {
	it('starts at 0 and ends at 1', () => {
		const ease = cubicBezier(0.215, 0.61, 0.355, 1);
		expect(ease(0)).toBe(0);
		expect(ease(1)).toBe(1);
		expect(ease(-1)).toBe(0);
		expect(ease(2)).toBe(1);
	});

	it('is the identity for a straight line', () => {
		const ease = cubicBezier(0.25, 0.25, 0.75, 0.75);
		for (const t of [0.1, 0.33, 0.5, 0.9]) expect(ease(t)).toBeCloseTo(t, 5);
	});

	it('matches known values for CSS ease-in-out', () => {
		const ease = cubicBezier(0.42, 0, 0.58, 1);
		expect(ease(0.5)).toBeCloseTo(0.5, 5);
		// Symmetrical about the midpoint.
		expect(ease(0.25) + ease(0.75)).toBeCloseTo(1, 5);
	});

	it('closely follows the cubic curves the reveal tokens approximate', () => {
		const easeOut = parseEasing(motion.easeRevealIn);
		const easeInOut = parseEasing(motion.easeRevealOut);
		const cubicOut = (t: number) => 1 - (1 - t) ** 3;
		const cubicInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
		for (let t = 0.05; t < 1; t += 0.05) {
			expect(Math.abs(easeOut(t) - cubicOut(t))).toBeLessThan(0.03);
			expect(Math.abs(easeInOut(t) - cubicInOut(t))).toBeLessThan(0.03);
		}
	});

	it('handles steep curves such as the interaction fade-out', () => {
		const ease = parseEasing(motion.easeOut);
		expect(ease(0.5)).toBeGreaterThan(0.9);
		expect(ease(0.5)).toBeLessThanOrEqual(1);
	});

	it('follows y past 0 and 1 for curves that overshoot', () => {
		const ease = cubicBezier(0.34, 1.56, 0.64, 1);
		expect(Math.max(...[0.5, 0.6, 0.7, 0.8].map(ease))).toBeGreaterThan(1);
	});
});

describe('parseEasing', () => {
	it('reads cubic-bezier values, with any spacing', () => {
		expect(parseEasing('cubic-bezier(0.42,0,0.58,1)')(0.5)).toBeCloseTo(0.5, 5);
		expect(parseEasing('  cubic-bezier(0.42, 0, 0.58, 1) ')(0.5)).toBeCloseTo(0.5, 5);
	});

	it('reads the CSS keywords', () => {
		expect(parseEasing('linear')(0.3)).toBe(0.3);
		expect(parseEasing('ease-out')(0.5)).toBeCloseTo(cubicBezier(0, 0, 0.58, 1)(0.5), 10);
		expect(parseEasing('ease')(0.5)).toBeCloseTo(cubicBezier(0.25, 0.1, 0.25, 1)(0.5), 10);
	});

	it('falls back to linear for anything it cannot read', () => {
		for (const value of ['', 'steps(4)', 'cubic-bezier(1, 2)', 'cubic-bezier(a, b, c, d)']) {
			expect(parseEasing(value)(0.3)).toBe(0.3);
		}
	});
});

describe('readDuration', () => {
	it('reads milliseconds and seconds', () => {
		expect(readDuration('200ms')).toBe(200);
		expect(readDuration(' 0.15s')).toBe(150);
		expect(readDuration('0ms')).toBe(0);
	});

	it('treats anything else as no animation', () => {
		expect(readDuration('')).toBe(0);
		expect(readDuration('fast')).toBe(0);
		expect(readDuration('200')).toBe(0);
	});
});
