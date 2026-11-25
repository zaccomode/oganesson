# Scroll Edge Effect

_See also: Scroll Edge Effect.sketchframe_

Oganesson's _scroll edge effect_ is used to elevate toolbars and action bars on scrollable content. It uses a progressive blur and gradient background to provide a smooth elevation from the content behind it.

The scroll edge effect should only be used where there is content on top of it; most regular scroll overflow without a toolbar should cleanly overflow.

## Layout

The effect is a bar across the full width of the top or bottom edge of the scrolling area, pinned there while the content scrolls underneath. Its contents (toolbars, and optionally a title that fills the space between them) sit in a row 8px apart, with 16px of padding, centred vertically, and centred horizontally when nothing fills the row. With a regular toolbar it is 66px tall.

## Appearance

1. **Gradient:** from Background 1 at 70% (`rgba(242,244,244,0.702)`) at the edge to transparent (`rgba(245,247,247,0)`) at the content side. These are one-off values from the Sketch file.
2. **Progressive blur:** a background blur of 4px at the edge, easing to none at the content side, drawn under the gradient.

On the Web, where a blur's radius can't vary across an element, the progressive blur is made of four stacked background-blur bands, 0.5px, 1px, 2px and 4px from the content side to the edge, each faded in and out with a mask so neighbouring bands blend. Because a mask, filter, opacity below 1 or background blur on an element stops its descendants' background blurs from seeing what's behind it, the bands sit beside the toolbars, never around them.

## Interaction

The effect doesn't take pointer input: clicks and scrolling on the faded areas around the toolbars reach the content underneath.
