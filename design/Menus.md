# Menus

_See also: Menus.sketchframe_

Menus in Oganesson are used to provide the user with a list of options. Menus are typically used for secondary or overflowing controls from a toolbar or collection of actions. Generally, row buttons should be used for all controls within a menu's items, each containing a unique icon and label. Menus should contain no more than 6 controls.

All controls are housed within a container with the system-standard elevated Acrylic style. This container can be positioned on any side of their parent control with a 2px offset. The default is the bottom edge of the parent with a right alignment. Where the menu cannot be displayed correctly, the system should automatically move the menu such that the entire thing is visible.

## Container

The container is 200px wide, with smooth 12px corners and 4px of padding around its items, which are 2px apart. It uses the elevated Acrylic style: Background 2 (Acrylic) with a 10px background blur, the elevated drop shadow and a white inner highlight (1px down, 6px blur).

## Trigger

While its menu is open, the control that opened it shows its active state (a thin glass background for subtle buttons), as in _Menus.sketchframe_.

## Items

Items are row buttons (see _Buttons.md — Row Variant_) and take a colorway like any subtle button: use Danger for destructive actions. They can carry a secondary label, such as a keyboard shortcut, or a secondary icon, and they can be disabled.

Items subscribe to the interaction animations. The highlighted item takes the hover layer, whether the pointer or the arrow keys put it there, and only one item is highlighted at a time. The highlight is the menu's focus indicator, so items don't show the focus ring.

## Keyboard

Enter, Space or the down arrow on the trigger open the menu with the first item highlighted. The up and down arrows move through the items and wrap around at the ends, Home and End jump to the first and last, and disabled items are skipped. Typing jumps to the next item whose label starts with what was typed. Enter or Space chooses the highlighted item; choosing an item, or pressing Escape, closes the menu and returns focus to the trigger.

## Motion

Menus open and close with the menu motion (see _Animations.md — Menu Motion_), scaling from the point where they meet their control: the corner on the aligned edge (the top-right corner for the default bottom, right-aligned menu), or the middle of the facing edge when the menu is centred.

## Guidance

Developers are warned (in development builds) when a menu holds more than 6 controls.
