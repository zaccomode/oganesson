// Usage: node webkit-hover-check.mjs <storybook-url> [webkit|chromium]
// Hovers and presses subtle buttons (inactive and active) and samples the pixel
// colour inside each one, to catch hover/press layers that aren't painted.
import { webkit, chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:6006';
const engine = (process.argv[3] ?? 'webkit') === 'chromium' ? chromium : webkit;
const browser = await engine.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 1 });
await page.goto(`${base}/iframe.html?id=buttons-button--subtle&viewMode=story`);
await page.waitForSelector('[data-case="dark-none-active"] .og-button');
await page.waitForTimeout(500);

async function sample(sel) {
	const box = await page.locator(sel).boundingBox();
	// 3px in from the left edge, vertically centred: padding, not label text.
	const x = Math.round(box.x + 4), y = Math.round(box.y + box.height / 2);
	const buf = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
	return page.evaluate(async (b64) => {
		const img = new Image();
		img.src = 'data:image/png;base64,' + b64;
		await img.decode();
		const c = document.createElement('canvas');
		c.width = c.height = 1;
		const ctx = c.getContext('2d');
		ctx.drawImage(img, 0, 0);
		return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).join(',');
	}, buf.toString('base64'));
}
const lum = (s) => s.split(',').map(Number).reduce((a, b) => a + b, 0);

const results = [];
for (const c of ['dark-none', 'dark-none-active', 'primary-none-active']) {
	const sel = `[data-case="${c}"] .og-button`;
	await page.mouse.move(5, 5);
	await page.waitForTimeout(1500);
	const rest = await sample(sel);
	await page.hover(sel, { position: { x: 4, y: 4 } });
	await page.waitForTimeout(300);
	const hover = await sample(sel);
	await page.mouse.down();
	await page.waitForTimeout(300);
	const pressed = await sample(sel);
	await page.mouse.up();
	await page.waitForTimeout(1200); // press layer fades out, still hovered
	const hoverAfterPress = await sample(sel);
	const ok = lum(hover) < lum(rest) && lum(pressed) < lum(hover) && Math.abs(lum(hoverAfterPress) - lum(hover)) <= 6;
	results.push({ case: c, rest, hover, pressed, hoverAfterPress, ok });
}
console.table(results);
await browser.close();
process.exit(results.every((r) => r.ok) ? 0 : 1);
