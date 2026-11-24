# Inputs

Inputs are a wide collection of fields used to collect data from users or control app functionality. Inputs can be used by themselves, or assembled into forms. Inputs come in a variety of shaes and sizes, each with particular purposes and recommended uses.

## Text Inputs

Text inputs are the simplest of the inputs, designed to collect free-text content from users. They're best used in situations that require short, single-line answers; longer answers may be best placed in a textarea, or broken out into separate atomic fields.

Text inputs have two styles:

1. **Default:** with a thin glass background, this displays the focusable area of the input to the user and should be used in most circumstances.
2. **Subtle:** contains no background, and should only be used in situations where the input itself is contained, such as within a toolbar.

Text inputs can optionally contain an icon to the left. Icons are best used to explain the field's purpose when it stands on its own (e.g. a search input), and are largely unnecessary if the field has a text label. Icons should be clear and explanatory. A group of fields should generally avoid re-using an icon.

Text inputs may contain placeholder content, which should always be a short description followed by ellipsis (...). Where the field has a visible label near it, the placeholder should be an example value (e.g. a name field with "John Doe"). Where the field has no visible label, the placeholder should indicate an action (e.g. a search field should use "Search items...").

_See also: Text Input.sketchframe_

### Text Input States

1. **Active:** while focused, a text input shows the focus indicator (see _Focus.md_). Subtle inputs show only its outer border. The icon switches from the secondary color to the solid Dark foreground.
2. **Hover:** text inputs subscribe to the interaction animations (see _Animations.md_), so hover adds a thin glass layer on top of the input's own background. Text inputs have **no press effect**: clicking into a field focuses it, which the active state already shows.
3. **Disabled:** the text and icon are drawn in the secondary color, and the input doesn't respond to hover or press. Its background is unchanged.

Placeholder text and the resting icon use Dark Secondary; entered text uses Dark. Clicking anywhere in the input, including its padding and icon, focuses it.

## Select Inputs

Select inputs are used to select a value from a fixed list of options. Select inputs follow many of the same rules as text inputs in regards to styling, the left icon and the placeholder.

Developers may choose if a select input has typeahead capability, thus allowing users to filter options based on their query. If typeahead functionality is enabled, users should be able to type their query into the primary input box.

_See also: Select Input.sketchframe and Select Input Menu Item.sketchframe_

Where too many items are present in a select input's menu, the dropdown menu should scroll. By default the menu shows up to **five** options and scrolls beyond that; developers can choose a different maximum number of items, or a maximum pixel height instead. Either way, the menu never extends past the top or bottom of the page, and scrolls once it reaches it.

_See also: Select Input Menu Exploration - Scrolling Items.sketchframe_

The default position of the dropdown menu should be selectable by the developer, or beneath the input by default. Where the system does not have sufficient height to display items in the dropdown, it should automatically flip orientation. The minimum height of the dropdown should be configurable by the developer as well, or default to 140px if unset: the menu shrinks to fit the space on its side down to this height, and flips to the other side when even that doesn't fit.

### Select Field

The field matches the text input: 28px tall, in the default or subtle style, with an optional 12px icon on the left. On the right is a 12px up-and-down chevron in Dark Secondary, which is a system icon (see _Icons.md_). The placeholder and resting icon use Dark Secondary; the selected option's label uses Dark. The icon turns Dark while the menu is open or the field has keyboard focus.

1. **Without typeahead**, the field is a button. Hover adds a thin glass layer and press a thick glass layer, as on a subtle button, and it shows the focus indicator for keyboard focus only (see _Focus.md_). Clicking it, or pressing Enter, Space or the arrow keys, opens the menu.
2. **With typeahead**, the field is a text field and follows the text input's states: no press effect, a text cursor, and the focus indicator whenever it's focused. Clicking anywhere in it focuses it and opens the menu. Typing filters the options to those whose label contains the text, ignoring case. When nothing matches, the menu says so in a single Dark Secondary row ("No results" by default). Closing the menu without choosing puts the selected option's label back in the field.
3. **Disabled** select inputs draw their text and icons in the secondary color and don't open.

### Select Menu

The menu uses the system's elevated Acrylic style (see _Menus.md_) with smooth 12px corners and 4px of padding, 2px from the field. It's at least as wide as the field, and grows to fit options with longer labels. Items are 28px tall and 2px apart.

Each item has a 12px check slot on the left, so labels line up whether or not their option is selected. The selected option shows a check there. Items subscribe to the interaction animations: the item under the pointer, or the one reached with the arrow keys, gains a thin glass layer, and pressing an item a thick glass one. When the menu opens, the selected option (or the first, if there's none) is highlighted, so the arrow keys continue from there. Disabled items are drawn in the secondary color and can't be chosen.

**Scrolling:** a scrolling menu draws its own scrollbar, a 2px rounded line in Dark at 40% opacity, 4px in from the right edge and inset 12px from the top and bottom. The menu's right padding widens to 8px to make room for it. Whenever there are options hidden above or below, a 20px overflow indicator fades the menu towards white (95% opacity) at that edge to encourage scrolling. These two colors are one-off values for menus, not palette colors.

**Motion:** the menu grows from 90% scale and sharpens from a 4px blur while fading in when it opens, and shrinks back to 90% and blurs while fading out when it closes, scaling from the middle of the edge facing the field: its top edge when it's below the field, its bottom edge when it's above. The entrance takes 100ms (ease-out) and the exit 300ms (the interaction fade-out curve); see _Animations.md — Menu Motion_.

## Switches

Switches are boolean inputs generally used to control whether a feature is "on" or "off". Switches should generally be accompanied by a visible label to the left.

Switches should not be used to toggle several items in a list, and should not be used where state may be indeterminate. In these cases, a checkbox field is more versatile and should be used instead.

_See also: Switch.sketchframe_

### Switch States

1. **Off:** a Dark Thin Glass track with a Dark thumb on the left.
2. **On:** a Dark track with a White thumb on the right.
3. **Toggling:** the thumb slides across, and the track and thumb colors change, using movement timing (150ms ease-out, the same in both directions; see _Buttons.md — Prominent Style_).
4. **Hover and press:** switches subscribe to the interaction animations. When off, hover adds a Dark Thin Glass layer and press a Dark Thick Glass layer. When on, the track is dark, so White Thin Glass and White Thick Glass layers are used instead.
5. **Focus:** keyboard focus shows the focus indicator (see _Focus.md_).
6. **Disabled:** the whole switch is shown at 50% opacity and doesn't respond.
