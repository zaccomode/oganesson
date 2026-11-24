# Icons

Oganesson doesn't ship its own icon set. [Lucide](https://lucide.dev) is the default icon library, but implementations must accept icons from any library (or custom artwork) and fit them to Oganesson themselves.

## Sizing

Icons are drawn in a square box. The default size is 14px, the size used throughout the Sketch files for button and input icons. Components may set a different size for their context; developers can override it per icon.

## Color

Icons always take the foreground color of their context: a danger button draws its icon in danger red, a disabled control in its disabled color. Icons should not set their own color.

## Accessibility

Icons are decorative by default and hidden from assistive technology, since a visible label usually accompanies them. An icon that conveys meaning on its own must be given an accessible label. Icon-only buttons are labelled by the button itself (see _Buttons.md — Icon Variant_).

## System Icons

Some components draw icons of their own, such as the chevron on a select input or the close button on a sheet modal. These use Lucide by default, and developers can replace them app-wide so an app using another icon library stays consistent.
