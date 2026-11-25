<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, spyOn, userEvent, waitFor } from 'storybook/test';
	import {
		Bold,
		Component as Placeholder,
		Copy,
		Ellipsis,
		FolderKey,
		Italic,
		Link,
		Pencil,
		Search,
		Share,
		Strikethrough,
		Trash2,
		Underline
	} from '@lucide/svelte';
	import {
		Button,
		IconButton,
		Menu,
		MenuItem,
		Select,
		TextInput,
		Toolbar,
		ToolbarGroup,
		ToolbarSeparator,
		TooltipProvider,
		type SelectOption
	} from '#lib';
	import { colors } from '#lib/tokens.js';
	import { sameColor } from '../color.js';

	const { Story } = defineMeta({
		title: 'Toolbars/Toolbar',
		component: Toolbar,
		tags: ['autodocs'],
		argTypes: {
			size: { control: 'inline-radio', options: ['regular', 'large'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Functionally similar controls elevated over the content behind them (Toolbars.md). A toolbar holds one or more **groups** (`<ToolbarGroup>`, the acrylic containers, 4px apart), and a group’s controls can be split into sections with `<ToolbarSeparator>`. It takes buttons, menus and inputs; prefer the subtle style. **Regular** suits most navigation; **large** emphasises its controls. Buttons share one tab stop and the arrow keys move between them. Pin a toolbar over scrolling content with `<ScrollEdgeEffect>`.'
				}
			}
		}
	});

	const projects: SelectOption[] = [
		{ value: 'sketchframe', label: 'Sketchframe' },
		{ value: 'oganesson', label: 'Oganesson' },
		{ value: 'lisse', label: 'Lisse' }
	];
	const project = $state({ value: 'sketchframe' });

	const rect = (el: Element) => el.getBoundingClientRect();
	const round = (n: number) => Math.round(n);
	const surfaceOf = (group: Element) =>
		group.querySelector<HTMLElement>('.og-toolbar-group-surface')!;
</script>

{#snippet more({ props, open }: { props: Record<string, unknown>; open: boolean })}
	<IconButton {...props} active={open} icon={Ellipsis} label="More" tooltip={false} />
{/snippet}

<Story name="Playground" args={{ size: 'regular' }}>
	{#snippet template(args)}
		<TooltipProvider>
			<Toolbar size={args.size} aria-label="Formatting">
				<ToolbarGroup>
					<IconButton icon={Bold} label="Bold" />
					<IconButton icon={Italic} label="Italic" />
					<IconButton icon={Underline} label="Underline" />
					<ToolbarSeparator />
					<IconButton icon={Link} label="Link" />
				</ToolbarGroup>
				<ToolbarGroup>
					<Menu trigger={more}>
						<MenuItem icon={Copy} label="Duplicate" />
						<MenuItem icon={Trash2} label="Delete" colorway="danger" />
					</Menu>
				</ToolbarGroup>
			</Toolbar>
		</TooltipProvider>
	{/snippet}
</Story>

<!-- Toolbars.sketchframe: a regular toolbar with two groups (a select input
     filling the first) and a large toolbar split into three sections. -->
<Story
	name="Toolbars"
	asChild
	play={async ({ canvasElement }) => {
		const [regular, large] = canvasElement.querySelectorAll<HTMLElement>('.og-toolbar');
		await expect(regular.getAttribute('role')).toBe('toolbar');

		// Regular: 234px wide, two groups 4px apart. The first fills the room the
		// second (hugging two 30px buttons in 2px padding and gaps) leaves.
		const [fill, hug] = regular.querySelectorAll<HTMLElement>('.og-toolbar-group');
		await expect(round(rect(regular).width)).toBe(234);
		await expect(round(rect(fill).width)).toBe(164);
		await expect(round(rect(hug).width)).toBe(66);
		await expect(round(rect(hug).height)).toBe(34);
		await expect(round(rect(hug).left - rect(fill).right)).toBe(4);
		const [first, second] = hug.querySelectorAll('.og-button');
		await expect(round(rect(first).left - rect(hug).left)).toBe(2);
		await expect(round(rect(first).top - rect(hug).top)).toBe(2);
		await expect(round(rect(second).left - rect(first).right)).toBe(2);
		const select = fill.querySelector('.og-select')!;
		await expect(round(rect(select).width)).toBe(160);
		await expect(round(rect(select).height)).toBe(30);

		// Acrylic (Elevated): translucent white, a 10px backdrop blur, the elevated
		// shadow, 10px corners.
		const surface = surfaceOf(hug);
		await expect(getComputedStyle(surface).backgroundColor).toBe('rgba(255, 255, 255, 0.7)');
		await expect(getComputedStyle(surface).backdropFilter).toBe('blur(10px)');
		await expect(getComputedStyle(hug).boxShadow).toContain('9px 20px');
		await expect(getComputedStyle(hug).borderRadius).toBe('10px');

		// Large: 4px padding and gaps, 12px corners, 252px across three sections.
		const group = large.querySelector<HTMLElement>('.og-toolbar-group')!;
		await expect(round(rect(group).width)).toBe(252);
		await expect(round(rect(group).height)).toBe(38);
		await expect(getComputedStyle(group).borderRadius).toBe('12px');
		const buttons = [...group.querySelectorAll('.og-button')];
		await expect(buttons).toHaveLength(7);
		await expect(round(rect(buttons[0]).left - rect(group).left)).toBe(4);
		await expect(round(rect(buttons[1]).left - rect(buttons[0]).right)).toBe(4);

		// Separators: 1px by 16px of dark thick glass, centred, the gap either side.
		const separators = [...group.querySelectorAll<HTMLElement>('.og-toolbar-separator')];
		await expect(separators).toHaveLength(2);
		const line = separators[0];
		await expect(line.getAttribute('role')).toBe('separator');
		await expect(line.getAttribute('aria-orientation')).toBe('vertical');
		await expect(rect(line).width).toBe(1);
		await expect(rect(line).height).toBe(16);
		await expect(round(rect(line).top - rect(group).top)).toBe(11);
		await expect(round(rect(line).left - rect(buttons[2]).right)).toBe(4);
		await expect(round(rect(buttons[3]).left - rect(line).right)).toBe(4);
		await expect(
			sameColor(getComputedStyle(line).backgroundColor, colors['dark-thick-glass'])
		).toBe(true);

		// The active button sits on thin glass.
		const active = buttons[6];
		await expect(active.hasAttribute('data-og-active')).toBe(true);
		await expect(
			sameColor(getComputedStyle(active).backgroundColor, colors['dark-thin-glass'])
		).toBe(true);
	}}
>
	<TooltipProvider>
		<div class="stack">
			<Toolbar aria-label="Project" style="width: 234px">
				<ToolbarGroup fill>
					<Select
						items={projects}
						bind:value={project.value}
						icon={FolderKey}
						aria-label="Project"
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<IconButton icon={Placeholder} label="Tooltip" />
					<IconButton icon={Placeholder} label="Tooltip" active />
				</ToolbarGroup>
			</Toolbar>
			<Toolbar size="large" aria-label="Editing">
				<ToolbarGroup>
					<IconButton icon={Placeholder} label="First" />
					<IconButton icon={Placeholder} label="Second" />
					<IconButton icon={Placeholder} label="Third" />
					<ToolbarSeparator />
					<IconButton icon={Placeholder} label="Fourth" />
					<IconButton icon={Placeholder} label="Fifth" />
					<ToolbarSeparator />
					<IconButton icon={Placeholder} label="Sixth" />
					<IconButton icon={Placeholder} label="Tooltip" active />
				</ToolbarGroup>
			</Toolbar>
		</div>
	</TooltipProvider>
</Story>

<!-- Buttons share one tab stop; the arrow keys move between them, across
     separators and groups, and menus keep their own keys. -->
<Story
	name="Keyboard"
	asChild
	play={async ({ canvasElement }) => {
		const toolbar = canvasElement.querySelector<HTMLElement>('.og-toolbar')!;
		const buttons = [...toolbar.querySelectorAll<HTMLElement>('.og-button')];
		const [bold, italic, underline, link, moreButton] = buttons;
		const before = canvasElement.querySelector<HTMLElement>('#before')!;
		const after = canvasElement.querySelector<HTMLElement>('#after')!;

		// One tab stop: the first button. The rest are reached with the arrows.
		await expect(buttons.map((b) => b.tabIndex)).toEqual([0, -1, -1, -1, -1]);
		before.focus();
		await userEvent.tab();
		await expect(document.activeElement).toBe(bold);
		await userEvent.tab();
		await expect(document.activeElement).toBe(after);

		// Arrows move across the separator and into the next group, and wrap.
		bold.focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(document.activeElement).toBe(italic);
		await userEvent.keyboard('{ArrowRight}{ArrowRight}');
		await expect(document.activeElement).toBe(link);
		await userEvent.keyboard('{ArrowRight}');
		await expect(document.activeElement).toBe(moreButton);
		await userEvent.keyboard('{ArrowRight}');
		await expect(document.activeElement).toBe(bold);
		await userEvent.keyboard('{End}');
		await expect(document.activeElement).toBe(moreButton);
		await userEvent.keyboard('{Home}{ArrowRight}{ArrowRight}');
		await expect(document.activeElement).toBe(underline);

		// The toolbar remembers where you were: Tab back in lands on the same button.
		await userEvent.tab();
		await expect(document.activeElement).toBe(after);
		await userEvent.tab({ shift: true });
		await expect(document.activeElement).toBe(underline);

		// A menu opened from the toolbar keeps its own arrow keys; its items aren't
		// toolbar buttons.
		moreButton.focus();
		await userEvent.keyboard('{Enter}');
		const menu = () => document.querySelector<HTMLElement>('.og-menu');
		await waitFor(() => expect(menu()).not.toBeNull());
		const items = [...menu()!.querySelectorAll<HTMLElement>('.og-menu-item')];
		await expect(items.some((item) => item.hasAttribute('data-toolbar-item'))).toBe(false);
		await waitFor(() => expect(document.activeElement).toBe(items[0]));
		await userEvent.keyboard('{ArrowDown}');
		await expect(document.activeElement).toBe(items[1]);
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(menu()).toBeNull());
		await waitFor(() => expect(document.activeElement).toBe(moreButton));
	}}
>
	<TooltipProvider>
		<div class="stack">
			<button id="before" class="native">Before</button>
			<Toolbar aria-label="Formatting">
				<ToolbarGroup>
					<IconButton icon={Bold} label="Bold" />
					<IconButton icon={Italic} label="Italic" />
					<IconButton icon={Underline} label="Underline" />
					<ToolbarSeparator />
					<IconButton icon={Link} label="Link" />
				</ToolbarGroup>
				<ToolbarGroup>
					<Menu trigger={more}>
						<MenuItem icon={Pencil} label="Rename" />
						<MenuItem icon={Share} label="Share" />
						<MenuItem icon={Trash2} label="Delete" colorway="danger" />
					</Menu>
				</ToolbarGroup>
			</Toolbar>
			<button id="after" class="native">After</button>
		</div>
	</TooltipProvider>
</Story>

<!-- Toolbars take every standard control: text buttons, links, subtle inputs and
     menus. Inputs keep their own tab stops because they use the arrow keys. -->
<Story
	name="Controls"
	asChild
	play={async ({ canvasElement }) => {
		const toolbar = canvasElement.querySelector<HTMLElement>('.og-toolbar')!;
		const input = toolbar.querySelector<HTMLInputElement>('input')!;
		const [save, docs, strike] = [...toolbar.querySelectorAll<HTMLElement>('.og-button')];

		// Text buttons and links join the roving focus; the input doesn't.
		await expect(save.hasAttribute('data-toolbar-item')).toBe(true);
		await expect(docs.tagName).toBe('A');
		await expect(docs.hasAttribute('data-toolbar-item')).toBe(true);
		await expect(input.hasAttribute('data-toolbar-item')).toBe(false);
		await expect(input.tabIndex).toBe(0);

		// Arrow keys in the input move its caret, not the toolbar's focus.
		await userEvent.click(input);
		await userEvent.type(input, 'abc');
		await userEvent.keyboard('{ArrowLeft}');
		await expect(document.activeElement).toBe(input);
		await expect(input.selectionStart).toBe(2);

		// Disabled buttons are skipped.
		save.focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(document.activeElement).toBe(docs);
		await userEvent.keyboard('{ArrowRight}');
		await expect(document.activeElement).not.toBe(strike);
	}}
>
	<TooltipProvider>
		<Toolbar aria-label="Document">
			<ToolbarGroup>
				<Button>Save</Button>
				<Button href="#docs">Docs</Button>
				<IconButton icon={Strikethrough} label="Strikethrough" disabled />
			</ToolbarGroup>
			<ToolbarGroup>
				<TextInput appearance="subtle" icon={Search} placeholder="Search..." aria-label="Search" />
			</ToolbarGroup>
			<ToolbarGroup>
				<Menu trigger={more}>
					<MenuItem icon={Copy} label="Duplicate" />
				</Menu>
			</ToolbarGroup>
		</Toolbar>
	</TooltipProvider>
</Story>

<!-- Toolbars.md: a toolbar must contain at least one group. Development builds
     warn in the console when it doesn't. -->
<Story
	name="Without a group"
	asChild
	beforeEach={() => {
		const warn = spyOn(console, 'warn').mockImplementation(() => {});
		return () => warn.mockRestore();
	}}
	play={async () => {
		await waitFor(() =>
			expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('no <ToolbarGroup>'))
		);
	}}
>
	<Toolbar aria-label="Ungrouped">
		<IconButton icon={Bold} label="Bold" tooltip={false} />
	</Toolbar>
</Story>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 50px;
		padding: 24px;
	}

	.native {
		font: inherit;
	}
</style>
