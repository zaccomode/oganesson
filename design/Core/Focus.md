# Focus

Every interactive element must show where focus is.

_See also: Text Input.sketchframe (the "Active" states)_

## Focus Indicator

A focused control shows a **1px Dark Thick Glass border just outside its edge** and a **0.5px Dark Secondary line just inside its edge**, both following the control's shape. A control with smooth corners gets an indicator with matching smooth corners (see _Shapes.md_). The indicator appears and disappears instantly.

This is the text input's designed active state, used throughout the system.

1. **Buttons and switches** show it for keyboard (and other non-pointer) focus only, not when focused by clicking or tapping.
2. **Text inputs** show it whenever they're focused, however focus arrived, because it is their active state. Subtle text inputs show only the outer border.

Because Web squircles clip anything drawn outside them, the indicator is drawn as a separate shape over the control rather than as a border or outline of the control itself.
