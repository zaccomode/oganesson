# Colors

_See also: Colors.sketchframe_

Oganesson uses a unique opacity-based color palette system to allow dynamic layering of styles.

## Palette

Each color comes in four steps. The solid step is the color itself; the others are the same color at a lower opacity, so they tint whatever sits behind them and can be stacked.

| Color   | Solid     | Secondary (60%)         | Thick Glass               | Thin Glass                 |
| ------- | --------- | ----------------------- | ------------------------- | -------------------------- |
| Dark    | `#21252b` | `rgba(33,37,43,0.6)`    | `rgba(33,37,43,0.141)`    | `rgba(33,37,43,0.059)`     |
| White   | `#ffffff` | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.141)` | `rgba(255,255,255,0.059)`  |
| Primary | `#5155ef` | `rgba(81,85,239,0.6)`   | `rgba(81,85,239,0.2)`     | `rgba(81,85,239,0.102)`    |
| Danger  | `#ce1e0c` | `rgba(206,30,12,0.6)`   | `rgba(206,30,12,0.141)`   | `rgba(206,30,12,0.078)`    |

1. **Solid** is used for primary foreground content such as text and icons.
2. **Secondary** is used for secondary text, such as small labels, subtitles and captions.
3. **Thick Glass** and **Thin Glass** are used for surface backgrounds and the hover and press layers described in _Animations.md_.

### Gradient Stops

Two further shades of Dark are used only as the gradient stops of prominent buttons (see _Buttons.md — Prominent Style_):

| Name        | Value     |
| ----------- | --------- |
| Dark Bright | `#3f434a` |
| Dark Deep   | `#090a0c` |

These are defined in _Buttons-Button (Prominent).sketchframe_ but are not yet in _Colors.sketchframe_.

## Backgrounds

| Name                    | Value                     |
| ----------------------- | ------------------------- |
| Background 1            | `#f2f4f4`                 |
| Background 2 (Acrylic)  | `rgba(255,255,255,0.702)` |

Acrylic is always combined with a background blur. Menus use a 10px blur and dialog modals a 24px blur.

## Dark Mode

Oganesson is light-only for now; a dark palette is being designed.
