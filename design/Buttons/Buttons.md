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

Each colorway draws every state from its own color: the foreground is the solid color, the hover and active backgrounds are its thin glass, and the press layer is its thick glass. Secondary content (such as a row button's secondary label and icon) uses its secondary step.

_See also: Buttons-Button (Subtle).sketchframe_

Subtle buttons should be used in most situations, as they convey low- or equal-priority user actions in a given situation.

### Prominent Style

Prominent buttons have a complex, tactile appearance and behaviour that makes them stand out from their surroundings. When hovered, prominent buttons should raise by 2px and show a drop shadow; when tapped, the button is lightened and pushed down by 2px to indicate a click or tap has been registered.

_See also: Prominent Button State Exploration.sketchframe_

Prominent buttons are exclusively available in the black-gray gradient appearance. The gradient runs top to bottom from `#3f434a` to `#090a0c`; these are one-off values for prominent buttons, not palette colors. The edge has a 1px white highlight fading from 30% at the top to nothing at the bottom, under a 0.5px `#090a0c` rim. The foreground is white, and pressing lays White Thick Glass over the gradient.

**Elevated** prominent buttons show the elevated drop shadow at rest. Elevation only controls the shadow: hovering still raises the button by 2px, whether or not it is elevated.

**Movement:** the 2px raise and push-down, and the shadow that comes with the raise, animate symmetrically over 150ms with an ease-out curve, both when hover or press begins and when it ends. This is deliberately not the asymmetric interaction-animation timing. The press lightening is a color change, so it still follows _Animations.md_. Under reduced motion, movement is instant in both directions.

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

Icon buttons come in two sizes: **regular** (28px square with a 16px icon) and **small** (20px square with a 12px icon and 6px corners), for dense areas.

_See also: Buttons-Icon Button (Subtle).sketchframe, Buttons-Icon Button (Prominent).sketchframe, Buttons-Small Icon Button (Subtle).sketchframe_

Tooltips are small Acrylic (elevated) pills holding the label in the caption style, drawn in the button colorway's secondary color (dark secondary for prominent buttons), 2px from the button. A tooltip also appears when the button receives keyboard focus.

All icon-only buttons will show a tooltip after 500ms of being hovered by default. This can be made instant, or the tooltip can be hidden entirely in space-constrained situations or where labels are unnecessary. If an icon-only button is being hovered and is displaying its tooltip, then hover moves to a new icon-only button within 500ms, the tooltip should immediately display on the new button.

The position of the tooltip (above or below) should be selectable by the developer, with it defaulting to above. Where the system does not have the room to properly display the tooltip, it should automatically change the position such that the tooltip is visible.

The developer may also choose to disable the tooltip entirely, however the system should place tooltips on icon buttons by default.

### Row Variant

Row buttons are designed to be used by menus, navigation areas, and forms where the width of the button is fixed. Row buttons always assume the entire width of their container, with the gap between the primary and secondary labels increasing.

Row buttons offer two secondary slots: a secondary label and a secondary icon. The secondary label can be used to display additional information about what lies beyond the button, such as the number of items present on the page the button links to. The secondary icon can be used to display what type of navigation this button might be — for example, a right chevron may be used for in-app navigation, and an external-link icon may be used for links that open in the user's browser or a new tab.

---

## States

### Disabled

Disabled buttons don't respond to hover or press and show no tooltip. Subtle buttons draw their foreground in their colorway's secondary color; prominent buttons are shown at 50% opacity. A disabled link is no longer a link: it can't be followed or focused.

### Focus

When a button receives keyboard focus, it shows the standard focus ring (see _Focus.md_). Focus from a pointer press shows no ring.

---

## Animations

Buttons subscribe to standard interaction animations. See "Interaction Animations" in Animations.md for more.
