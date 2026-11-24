# Buttons

Buttons are tappable surfaces used to perform actions and navigate throughout the application.

## Button Styles

Buttons can have one of many primary display styles, which controls its general appearance and how it behaves. It does not control the button's contents, shape or size. Button styles are:

1. **Subtle:** with no background by default and a thin glass background when hovered or active, subtle buttons are designed to convey low-priority/regular actions that don't require the user's attention. Subtle buttons come in a variety of colors for different situations.
2. **Prominent:** with a distinctive black-gray gradient and an optional elevated appearance, prominent buttons are used to show the recommended or most likely action in a given scenario.

### Subtle Style

By default, subtle buttons have no background and a solid-color foreground. When hovered or active, they transition to a thin glass material and a blurred background. When pressed, the button is darkened to indicate a click or tap has been registered.

Opacity effects of subtle buttons are stacked: if an active button is hovered, the active/hover effect should be applied twice. Likewise, the pressed effect should be layered upon the hover style.

_See also: Subtle Button State Exploration.sketchframe_

Subtle buttons come in a variety of colorways, to be used in different scenarios:

1. **Dark (default):** this is the standard appearance and should generally be used.
2. **Primary:** generally used for slightly more prominent buttons, such as a selected navigation button or a recommended action.
3. **Danger:** used to convey a dangerous action.

_See also: Buttons-Button (Subtle).sketchframe_

Subtle buttons should be used in most situations, as they convey low- or equal-priority user actions in a given situation.

### Prominent Style

Prominent buttons have a complex, tactile appearance and behaviour that makes them stand out from their surroundings. When hovered, prominent buttons should raise by 2px and show a drop shadow; when tapped, the button is lightened and pushed down by 2px to indicate a click or tap has been registered.

_See also: Prominent Button State Exploration.sketchframe_

Prominent buttons are exclusively available in the black-gray gradient appearance.

_See also: Buttons-Button (Prominent).sketchframe_

Prominent buttons should be used reservedly to communicate a high-important or recommended next action to the user. Generally, only one prominent button should be visible to the user at a time. If multiple actions are equally recommended by the system, no prominent buttons should be used.

---

## Button Variants

A button _variant_ can modify its content and shape, generally for use in different situations. A button may have a design style and a variant; the two work together. Button variants are:

1. **Default:** most buttons are composed of a label and possibly an icon positioned to the left or right. This is the standard appearance for a button.
2. **Icon:** for things like toolbars with many actions, an icon-only button may be more suitable. These should use descriptive icons and always include a label for accessibility and the tooltip.
3. **Row:** where a button ought to take up the full width of a view for navigation or forms, a row button is best used. It offers a secondary icon and label for advanced use-cases.

### Default Variant

The default variant of a button is a label with an optional icon positioned either to the left or right of the label.

### Icon Variant

Icon-only buttons must always have a label supplied for accessibility reasons. That label is reused for the tooltip.

All icon-only buttons will show a tooltip after 500ms of being hovered by default. This can be made instant, or the tooltip can be hidden entirely in space-constrained situations or where labels are unnecessary. If an icon-only button is being hovered and is displaying its tooltip, then hover moves to a new icon-only button within 200ms, the tooltip should immediately display on the new button.

The position of the tooltip (above or below) should be selectable by the developer, with it defaulting to above. Where the system does not have the room to properly display the tooltip, it should automatically change the position such that the tooltip is visible.

The developer may also choose to disable the tooltip entirely, however the system should place tooltips on icon buttons by default.

### Row Variant

Row buttons are designed to be used by menus, navigation areas, and forms where the width of the button is fixed. Row buttons always assume the entire width of their container, with the gap between the primary and secondary labels increasing.

Row buttons offer two secondary slots: a secondary label and a secondary icon. The secondary label can be used to display additional information about what lies beyond the button, such as the number of items present on the page the button links to. The secondary icon can be used to display what type of navigation this button might be — for example, a right chevron may be used for in-app navigation, and an external-link icon may be used for links that open in the user's browser or a new tab.

---

## Animations

Buttons subscribe to standard interaction animations. See "Interaction Animations" in Animations.md for more.
