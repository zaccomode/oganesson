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

## Select Inputs

Select inputs are used to select a value from a fixed list of options. Select inputs follow many of the same rules as text inputs in regards to styling, the left icon and the placeholder.

Developers may choose if a select input has typeahead capability, thus allowing users to filter options based on their query. If typeahead functionality is enabled, users should be able to type their query into the primary input box.

_See also: Select Input.sketchframe and Select Input Menu Item.sketchframe_

Where too many items are present in a select input's menu, the dropdown menu should scroll. Developers should be able to select a maximum pixel height, maximum number of items, or by default allow the menu to extend to the full height of the page and scroll once it reaches the top or bottom of the page.

_See also: Select Input Menu Exploration - Scrolling Items.sketchframe_

The default position of the dropdown menu should be selectable by the developer, or beneath the input by default. Where the system does not have sufficient height to display items in the dropdown, it should automatically flip orientation. The minimum height of the dropdown should be configurable by the developer as well, or default to 140px if unset.

## Switches

Switches are boolean inputs generally used to control whether a feature is "on" or "off". Switches should generally be accompanied by a visible label to the left.

Switches should not be used to toggle several items in a list, and should not be used where state may be indeterminate. In these cases, a checkbox field is more versatile and should be used instead.

_See also: Switch.sketchframe_
