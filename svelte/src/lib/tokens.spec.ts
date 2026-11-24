import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { backgrounds, colors, iconSize, motion, radius, typography } from './tokens';

const tokensCss = readFileSync(new URL('./styles/tokens.css', import.meta.url), 'utf8');
const typographyCss = readFileSync(new URL('./styles/typography.css', import.meta.url), 'utf8');

/** Value of a custom property as declared in tokens.css (first declaration). */
function cssVar(name: string): string | undefined {
	const match = tokensCss.match(new RegExp(`${name}:\\s*([^;]+);`));
	return match?.[1].trim();
}

/** Declarations inside the first `.selector { … }` block that sets font-size. */
function rule(selector: string): Record<string, string> {
	const blocks = [...typographyCss.matchAll(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`, 'g'))];
	const body = blocks.find((b) => b[1].includes('font-size'))?.[1] ?? '';
	return Object.fromEntries(
		body
			.split(';')
			.map((d): [string, string] => {
				const [key = '', value = ''] = d.split(':').map((s) => s.trim());
				return [key, value];
			})
			.filter(([key, value]) => key && value)
	);
}

describe('tokens.ts mirrors tokens.css', () => {
	it.each(Object.entries(colors))('--og-color-%s', (name, value) => {
		expect(cssVar(`--og-color-${name}`)).toBe(value);
	});

	it.each(Object.entries(backgrounds))('--og-bg-%s', (name, value) => {
		expect(cssVar(`--og-bg-${name}`)).toBe(value);
	});

	it('radius, icon size and motion', () => {
		expect(cssVar('--og-radius')).toBe(`${radius}px`);
		expect(cssVar('--og-icon-size')).toBe(`${iconSize}px`);
		expect(cssVar('--og-ease-out')).toBe(motion.easeOut);
		expect(cssVar('--og-duration-hover-out')).toBe(`${motion.hoverOutMs}ms`);
		expect(cssVar('--og-duration-press-out')).toBe(`${motion.pressOutMs}ms`);
	});

	it('declares no colour token missing from tokens.ts', () => {
		const declared = [...tokensCss.matchAll(/--og-color-([a-z-]+):/g)].map((m) => m[1]);
		expect(declared.sort()).toEqual(Object.keys(colors).sort());
	});
});

describe('tokens.ts mirrors typography.css', () => {
	it.each(Object.entries(typography))('.og-%s', (variant, style) => {
		const decl = rule(`.og-${variant}`);
		expect(decl['font-size']).toBe(`${style.size}px`);
		expect(decl['line-height']).toBe(`${style.lineHeight}px`);
		if (decl['font-weight']) expect(decl['font-weight']).toBe(String(style.weight));
	});
});
