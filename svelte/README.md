# oganesson-svelte

The Svelte implementation of [Oganesson](../README.md), built on [Bits UI](https://www.bits-ui.com). The design spec in [`/design`](../design) is the source of truth; this package follows it exactly.

> Pre-release. Foundations only so far: tokens, text styles, icons, squircles and interaction surfaces. Components arrive milestone by milestone.

## Using it

```sh
npm install oganesson-svelte
```

Requires Svelte 5.32 or later. Importing anything from the package also loads its stylesheet: the design tokens, the self-hosted fonts (Instrument Sans and Geist Mono) and the text styles.

```svelte
<script>
	import { Text, Icon } from 'oganesson-svelte';
	import { Search } from '@lucide/svelte';
</script>

<Text variant="title">Library</Text>
<Icon icon={Search} />
```

To load only the styles (for example in a page with no Oganesson components), import `oganesson-svelte/styles.css`.

### Tokens

Every token is a CSS custom property, e.g. `var(--og-color-primary-thin-glass)`, `var(--og-radius)`, `var(--og-ease-out)`. The same values are available in script as `import { tokens } from 'oganesson-svelte'`.

### Icons

`<Icon>` accepts any Svelte icon component (Lucide, Phosphor, Tabler, …) or raw SVG, and sizes and colours it to fit: `--og-icon-size` (14px by default) and the surrounding text colour. To replace the icons Oganesson draws itself, call `setOganessonIcons({ close: MyX })` in your root layout.

### Squircles

`{@attach squircle()}` gives any element with a CSS `border-radius` smooth corners. Because the corners are made with `clip-path`, draw borders and shadows on those elements through the `effects` option rather than CSS.

## Developing

```sh
npm install
npm run storybook     # docs and playground on http://localhost:6006
npm test              # unit tests and every story as a browser test (Playwright)
npm run check         # svelte-check
npm run lint          # prettier and eslint
npm run build         # build dist/ and run publint
```

- Library code lives in `src/lib`; stories in `src/stories`.
- Stories double as tests: each story renders in Chromium, runs its `play` function and is checked with axe.
- `src/lib/styles/tokens.css` is the source of truth for tokens; `src/lib/tokens.ts` mirrors it and a unit test keeps them in step.
