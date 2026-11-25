# Toolbars

_See also: Toolbars.sketchframe_

Toolbars are used to display functionally similar controls elevated over content behind them. Toolbars are typically fixed to an edge or corner of its parent container, remaining still while the content underneath it scrolls.

Toolbars must contain at least one group, and controls within each group can be logically grouped using a vertical separator. A developer can use a combination of groups and separators to organise the contents of a toolbar.

Toolbars accept many standard buttons, menus and inputs as children. Controls within toolbars should prefer the "subtle" style.

Toolbars come in two sizes for different situations:

1. **Regular/default:** best used in most circumstances, regular toolbars are the standard appearance for a toolbar.
2. **Large:** used to emphasise the controls within the toolbar.

Toolbars over scrolling content should typically include a scroll edge effect behind them. See Scroll Edge Effect.md for more details.

## Groups

A group is the acrylic container that holds a toolbar's controls, in the elevated Acrylic style: Background 2 (Acrylic) with a 10px background blur, the elevated drop shadow and a white inner highlight (1px down, 6px blur), with smooth corners. Groups in a toolbar sit 4px apart, aligned to their tops. A group hugs its controls; it can instead stretch to fill the width left in the toolbar (as the group holding the select input does in _Toolbars.sketchframe_), and its controls then share that width.

| Size    | Corner radius | Padding | Gap between controls |
| ------- | ------------- | ------- | -------------------- |
| Regular | 10px          | 2px     | 2px                  |
| Large   | 12px          | 4px     | 4px                  |

Controls keep their own sizes in both: a regular icon button is 30px square, so a regular group is 34px tall and a large one 38px.

## Separators

A separator is a vertical line 1px wide and 16px tall in Dark Thick Glass, centred in the group, with the group's gap on either side. It divides a group's controls into sections.

## Keyboard

A toolbar is a single tab stop for its buttons, including the buttons that open menus. Tab moves into the toolbar onto the button that last had focus (the first, to begin with), the left and right arrows move between its buttons across separators and groups, wrapping around at the ends, and Home and End jump to the first and last. Disabled buttons are skipped. Text inputs and select inputs keep their own tab stops, because they use the arrow keys themselves. A menu opened from a toolbar uses its own keys (see _Menus.md — Keyboard_).

## Placement

A toolbar pinned to the top or bottom edge of scrolling content sits on a scroll edge effect, which stretches the full width of the edge (see _Scroll Edge Effect.md_). Several toolbars, and a title between them, can share one edge.

## Guidance

Developers are warned (in development builds) when a toolbar has no group.
