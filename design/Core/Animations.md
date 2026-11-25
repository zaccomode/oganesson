# Animations

Oganesson offers many unique animations that are used throughout the application to indicate interaction, movement, and position.

## Interaction Animations

Interaction animations give feedback when the user hovers over or presses an interactive surface, such as a button or input. They apply to an element's colours (its background and its foreground) and are deliberately asymmetrical: a colour change appears instantly when the interaction begins, then fades out slowly once it ends. The instant response makes the interface feel immediate, and the slow fade shows where the user has just been.

Movement, such as a prominent button rising on hover, is not an interaction animation and is not covered by these rules. Movement uses short, symmetrical timing instead (150ms ease-out both ways; see _Buttons.md — Prominent Style_).

### Timing

| Interaction | In      | Out    |
| ----------- | ------- | ------ |
| Hover       | Instant | 500ms  |
| Press       | Instant | 1000ms |
| Focus       | Instant | 500ms  |

All fade-outs use the easing curve `cubic-bezier(0.16, 1, 0.3, 1)`, a strong ease-out that moves most of the way quickly and then settles gently. Fade-ins are instant, so no easing applies to them.

The same timing applies to both background and foreground changes, so an element's colours always move together.

### Hover

When hovered, a subtle surface gains a thin glass layer on top of its current background, so hover stacks the same way press does (see _Buttons.md — Subtle Style_ and _Subtle Button State Exploration.sketchframe_):

1. **Inactive surfaces** go from transparent to one layer of thin glass.
2. **Active surfaces**, whose background is already thin glass, gain a second thin glass layer on top.

When hover ends, the layer fades out over 500ms. Disabled surfaces don't respond to hover.

Hover effects only apply on devices with a pointer that can hover. On touch screens, a tap shows the press effect alone, so no hover state is left behind after the finger lifts.

### Press

The press effect is drawn as a separate layer on top of the element's current background, so it stacks on the hover effect instead of replacing it, as described in _Buttons.md — Subtle Style_. The layer appears instantly when pressed, fades out over 1000ms on release, follows the element's corner radius, and doesn't capture pointer events.

1. **Subtle surfaces** use a thick glass layer, darkening the surface.
2. **Prominent buttons** use a lightening layer over their gradient.

Disabled surfaces don't show the press effect. Neither do text inputs: pressing one focuses it, and its active state shows that instead (see _Inputs.md_). Nor do switches: pressing one stretches its thumb towards where it will travel, using movement timing (see _Inputs.md — Switch States_).

### Focus

The focus indicator follows the same pattern: it appears instantly when a control gains focus and fades out over 500ms when focus leaves (see _Focus.md_).

### Reduced Motion

When the user has requested reduced motion, every duration is zero: colours change instantly in both directions. The visual states themselves are unchanged.

### Applies To

1. **Subtle buttons**, in all variants (default, icon, row).
2. **Prominent buttons**, for their background only. Their raise and push-down movement is specified separately.
3. **Inputs**, such as the text input, the select input and the switch (hover only; its thumb slide and press stretch use movement timing).
4. **Menu items**, such as a menu's row buttons and a select input's options. The highlighted item, whether under the pointer or reached with the arrow keys, takes the hover layer.

## Menu Motion

Menus and select input menus grow from 90% scale and sharpen from a 4px blur while fading in when they open, and shrink back to 90% and blur back to 4px while fading out when they close, scaling from the middle of the edge facing the control: the top edge when the menu is below it, the bottom edge when it's above. Menus aligned to one end of their control scale from the corner on that end instead (see _Menus.md — Motion_). The entrance takes **100ms** with `ease-out` (`cubic-bezier(0, 0, 0.58, 1)`), the movement curve, and the exit **300ms** with the interaction fade-out curve `cubic-bezier(0.16, 1, 0.3, 1)`. The quick entrance keeps opening a menu feeling immediate; the exit moves most of the way at once, so the menu gets out of the way (see _Inputs.md — Select Menu_).

Implementation note: apply the fade and blur to the element that carries the menu's acrylic backdrop blur (and to anything drawn beside it, such as the inner-shadow overlay), never to an ancestor of it. An ancestor with opacity below 1 or a filter isolates a descendant's backdrop blur, so in WebKit the acrylic only appears once the entrance has finished. The scale and drop shadow can sit on an outer element, since transforms don't isolate backdrops.
