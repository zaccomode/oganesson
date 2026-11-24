# Focus

Every interactive element must show where focus is.

_See also: Inputs-Text Input.sketchframe (the "Active" states)_

## Focus Indicator

A focused control shows a **1px Thick Glass border just outside its edge** and a **0.5px Secondary line just inside its edge**, both following the control's shape. A control with smooth corners gets an indicator with matching smooth corners (see _Shapes.md_).

This is the text input's designed active state, used throughout the system.

1. **Buttons, switches and select inputs** (without typeahead) show it for keyboard (and other non-pointer) focus only, not when focused by clicking or tapping.
2. **Text inputs**, and select inputs with typeahead, show it whenever they're focused, however focus arrived, because it is their active state. Subtle inputs show only the outer border.

### Color

The indicator is drawn in the control's color: subtle Primary buttons use Primary Thick Glass and Primary Secondary, and subtle Danger buttons use Danger Thick Glass and Danger Secondary. Everything else, including dark subtle buttons, prominent buttons, switches and text inputs, uses Dark Thick Glass and Dark Secondary.

### Animation

The indicator follows the interaction animations (see _Animations.md_): it **appears instantly** and **fades out over 500ms** with the curve `cubic-bezier(0.16, 1, 0.3, 1)`. The instant appearance keeps focus feeling immediate. The slow fade-out shows where focus has just left, the same way hover and press fades show where the pointer has just been. With reduced motion, the indicator appears and disappears instantly.

Because Web squircles clip anything drawn outside them, the indicator is drawn as a separate shape over the control rather than as a border or outline of the control itself.
