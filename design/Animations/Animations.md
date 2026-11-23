# Animations

Oganesson offers many unique animations that are used throughout the application to indicate interaction, movement, and position.

## Interaction Animations

Interaction animations give feedback when the user hovers over or presses an interactive surface, such as a button or input. They apply to an element's colours (its background and its foreground) and are deliberately asymmetrical: a colour change appears instantly when the interaction begins, then fades out slowly once it ends. The instant response makes the interface feel immediate, and the slow fade shows where the user has just been.

Movement, such as a prominent button rising on hover, is not an interaction animation and is not covered by these rules.

### Timing

| Interaction | In      | Out    |
| ----------- | ------- | ------ |
| Hover       | Instant | 500ms  |
| Press       | Instant | 1000ms |

All fade-outs use the easing curve `cubic-bezier(0.16, 1, 0.3, 1)`, a strong ease-out that moves most of the way quickly and then settles gently. Fade-ins are instant, so no easing applies to them.

The same timing applies to both background and foreground changes, so an element's colours always move together.

### Hover

When hovered, a subtle surface's background steps up one glass level:

1. **Inactive surfaces** go from transparent to thin glass.
2. **Active surfaces** go from thin glass to thick glass.

When hover ends, the background fades back over 500ms. Disabled surfaces don't respond to hover.

### Press

The press effect is drawn as a separate layer on top of the element's current background, so it stacks on the hover effect instead of replacing it, as described in _Buttons.md — Subtle Style_. The layer appears instantly when pressed, fades out over 1000ms on release, follows the element's corner radius, and doesn't capture pointer events.

1. **Subtle surfaces** use a thick glass layer, darkening the surface.
2. **Prominent buttons** use a lightening layer over their gradient.

Disabled surfaces don't show the press effect.

### Reduced Motion

When the user has requested reduced motion, every duration is zero: colours change instantly in both directions. The visual states themselves are unchanged.

### Applies To

1. **Subtle buttons**, in all variants (default, icon, row).
2. **Prominent buttons**, for their background only. Their raise and push-down movement is specified separately.
3. **Inputs**, such as the text input and the select input.
