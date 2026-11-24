# oganesson-svelte

The Svelte implementation of [Oganesson](../README.md), built on [Bits UI](https://www.bits-ui.com). The design spec in [`/design`](../design) is the source of truth; this package follows it exactly.

> Pre-release. So far: foundations (tokens, text styles, icons, squircles, interaction surfaces), buttons, the text input and the switch. More components arrive milestone by milestone.

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

### Buttons

```svelte
<script>
	import { Button, IconButton, RowButton, TooltipProvider } from 'oganesson-svelte';
	import { Plus, Trash2, ChevronRight } from '@lucide/svelte';
</script>

<Button appearance="prominent" icon={Plus} onclick={create}>New project</Button>
<Button colorway="danger">Delete</Button>

<TooltipProvider>
	<IconButton icon={Trash2} label="Delete" colorway="danger" />
</TooltipProvider>

<RowButton href="/inbox" secondaryLabel="12" secondaryIcon={ChevronRight}>Inbox</RowButton>
```

Wrap your app in `<TooltipProvider>` so icon-button tooltips share timing: 500ms to appear, then immediately when moving to another button within 500ms.

### Inputs

```svelte
<script>
	import { TextInput, Switch } from 'oganesson-svelte';
	import { Search } from '@lucide/svelte';
	let query = $state('');
	let notify = $state(false);
</script>

<TextInput bind:value={query} icon={Search} placeholder="Search items..." aria-label="Search" />

<label for="notify">Notifications</label>
<Switch id="notify" bind:checked={notify} />
```

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
