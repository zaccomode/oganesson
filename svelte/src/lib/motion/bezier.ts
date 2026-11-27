/**
 * Turns a CSS easing value into a JS easing function, so script-driven
 * animations (such as `reveal`) can follow the `--og-ease-*` tokens.
 *
 * Supports `cubic-bezier(x1, y1, x2, y2)` and the keywords `linear`, `ease`,
 * `ease-in`, `ease-out` and `ease-in-out`. Anything else falls back to linear.
 */

export type EasingFunction = (t: number) => number;

const keywords: Record<string, [number, number, number, number]> = {
	ease: [0.25, 0.1, 0.25, 1],
	'ease-in': [0.42, 0, 1, 1],
	'ease-out': [0, 0, 0.58, 1],
	'ease-in-out': [0.42, 0, 0.58, 1]
};

const linear: EasingFunction = (t) => t;

export function parseEasing(value: string): EasingFunction {
	const css = value.trim().toLowerCase();
	if (css in keywords) return cubicBezier(...keywords[css]);
	const match = /^cubic-bezier\(([^)]*)\)$/.exec(css);
	const points = match?.[1].split(',').map(Number);
	if (!points || points.length !== 4 || points.some((n) => !Number.isFinite(n))) return linear;
	return cubicBezier(points[0], points[1], points[2], points[3]);
}

/** The easing function for a CSS `cubic-bezier(x1, y1, x2, y2)`. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
	// Each axis is a cubic polynomial in the curve parameter s: ((a·s + b)·s + c)·s.
	const cx = 3 * x1,
		bx = 3 * (x2 - x1) - cx,
		ax = 1 - cx - bx;
	const cy = 3 * y1,
		by = 3 * (y2 - y1) - cy,
		ay = 1 - cy - by;
	const x = (s: number) => ((ax * s + bx) * s + cx) * s;
	const y = (s: number) => ((ay * s + by) * s + cy) * s;
	const dx = (s: number) => (3 * ax * s + 2 * bx) * s + cx;

	return (t) => {
		if (t <= 0) return 0;
		if (t >= 1) return 1;
		// Find s where x(s) = t: Newton's method, falling back to bisection
		// where the slope is too flat to trust.
		let s = t;
		for (let i = 0; i < 8; i++) {
			const error = x(s) - t;
			if (Math.abs(error) < 1e-6) return y(s);
			const slope = dx(s);
			if (Math.abs(slope) < 1e-6) break;
			s -= error / slope;
		}
		let lo = 0,
			hi = 1;
		s = t;
		while (hi - lo > 1e-6) {
			if (x(s) < t) lo = s;
			else hi = s;
			s = (lo + hi) / 2;
		}
		return y(s);
	};
}
