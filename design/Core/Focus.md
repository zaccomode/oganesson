# Focus

Every interactive element must show where keyboard focus is.

## Focus Ring

A focused control shows a **2px Dark ring, 2px outside the control**, following its shape: a control with smooth corners gets a ring with matching smooth corners (see _Shapes.md_).

The ring appears only for keyboard focus (and other non-pointer focus), not when a control is focused by clicking or tapping it. It appears and disappears instantly.

Because Web squircles clip anything drawn outside them, the ring is drawn as a separate shape around the control rather than as an outline of the control itself.
