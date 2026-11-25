# oganesson-svelte

The Svelte implementation of [Oganesson](../README.md), built on [Bits UI](https://www.bits-ui.com). The design spec in [`/design`](../design) is the source of truth; this package follows it exactly.

> Pre-release. So far: foundations (tokens, text styles, icons, squircles, interaction surfaces), buttons, the text input, the switch, the select input, menus and toolbars. More components arrive milestone by milestone.

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
	import { TextInput, Switch, Select } from 'oganesson-svelte';
	import { Globe, Search } from '@lucide/svelte';
	let query = $state('');
	let notify = $state(false);
	let country = $state('');
	const countries = [
		{ value: 'nz', label: 'New Zealand' },
		{ value: 'au', label: 'Australia' }
	];
</script>

<TextInput bind:value={query} icon={Search} placeholder="Search items..." aria-label="Search" />

<label for="notify">Notifications</label>
<Switch id="notify" bind:checked={notify} />

<Select
	bind:value={country}
	items={countries}
	icon={Globe}
	placeholder="Choose a country..."
	aria-label="Country"
/>
```

`<Select>` shows up to `maxItems` (5) options before scrolling, or set `maxHeight` in pixels. The menu opens on `side` (`bottom` by default) and flips when there's less than `minHeight` (140px) of room. Add `typeahead` to let people type to filter the options. Add `allowEmpty` to put a "None" option at the top that clears the value back to `''` (rename it with `emptyOptionLabel`).

### Menus

```svelte
<script>
	import { Menu, MenuItem, IconButton } from 'oganesson-svelte';
	import { Ellipsis, Pencil, Trash2 } from '@lucide/svelte';
</script>

<Menu>
	{#snippet trigger({ props, open })}
		<IconButton {...props} active={open} icon={Ellipsis} label="More" tooltip={false} />
	{/snippet}
	<MenuItem icon={Pencil} label="Rename" onSelect={rename} />
	<MenuItem icon={Trash2} label="Delete" colorway="danger" onSelect={remove} />
</Menu>
```

Spread the trigger snippet's `props` onto any button; pass `active={open}` so it looks active while the menu shows. The menu opens below the trigger, right-aligned, 200px wide; set `side` (`top`, `right`, `bottom`, `left`) and `align` (`start`, `center`, `end`) to move it, and it repositions itself to stay in view. Items take a `colorway`, a `secondaryLabel` or `secondaryIcon`, `disabled` or `href`. Keep menus to 6 items; development builds warn above that.

### Toolbars

```svelte
<script>
	import {
		Toolbar,
		ToolbarGroup,
		ToolbarSeparator,
		ScrollEdgeEffect,
		IconButton
	} from 'oganesson-svelte';
	import { Bold, Italic, Link } from '@lucide/svelte';
</script>

<div style="overflow: auto">
	<ScrollEdgeEffect edge="top">
		<Toolbar aria-label="Formatting">
			<ToolbarGroup>
				<IconButton icon={Bold} label="Bold" />
				<IconButton icon={Italic} label="Italic" />
				<ToolbarSeparator />
				<IconButton icon={Link} label="Link" />
			</ToolbarGroup>
		</Toolbar>
	</ScrollEdgeEffect>
	…content…
</div>
```

A toolbar holds one or more `<ToolbarGroup>`s (the acrylic containers, 4px apart); `<ToolbarSeparator>` splits a group into sections. Set `size="large"` to emphasise the controls, and `fill` on a group to stretch it across the room left (for example around a `<Select>`). Buttons and menu triggers inside share one tab stop and the arrow keys move between them; inputs keep their own tab stops.

`<ScrollEdgeEffect>` pins its toolbars to the `top` (default) or `bottom` edge of the scroll container with `position: sticky`, over a progressive blur and gradient. Make it a direct child of the scrolling element: first for the top, last for the bottom. Its children sit in a row, 8px apart and 16px in; give a title `flex: 1` to push toolbars to either end. Set `pinned={false}` to position it yourself. Use it only under toolbars.

### Tokens

Every token is a CSS custom property, e.g. `var(--og-color-primary-thin-glass)`, `var(--og-radius)`, `var(--og-ease-out)`. The same values are available in script as `import { tokens } from 'oganesson-svelte'`.

### Icons

`<Icon>` accepts any Svelte icon component (Lucide, Phosphor, Tabler, …) or raw SVG, and sizes and colours it to fit: `--og-icon-size` (16px by default) and the surrounding text colour. To replace the icons Oganesson draws itself, call `setOganessonIcons({ close: MyX })` in your root layout.

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
