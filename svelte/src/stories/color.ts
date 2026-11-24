/**
 * Browsers store alpha in 8 bits, so `rgba(…, 0.059)` reads back as `0.06`.
 * Parse a computed colour so stories can compare it to a token within that precision.
 */
export function parseColor(value: string): [number, number, number, number] {
	const parts = value.match(/[\d.]+/g)?.map(Number) ?? [];
	const [r = NaN, g = NaN, b = NaN, a = 1] = value.startsWith('#') ? hex(value) : parts;
	return [r, g, b, a];
}

function hex(value: string): number[] {
	const h = value.slice(1);
	return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** True when two CSS colours match to within 8-bit alpha precision. */
export function sameColor(actual: string, expected: string): boolean {
	const a = parseColor(actual);
	const e = parseColor(expected);
	return a.slice(0, 3).every((c, i) => c === e[i]) && Math.abs(a[3] - e[3]) <= 1 / 255;
}
