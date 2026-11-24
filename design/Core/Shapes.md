# Shapes

## Squircles & Smooth Corners

Where supported by the system, all elements with rounded corners in Oganesson should use a smooth corner (or "squircle") style.

In Web environments where squircles are not natively supported, the system should use a library like [Lisse](https://github.com/JaceThings/Lisse) to achieve squircle corners where border radii >=8px.

### Values

1. **Radius:** the standard corner radius is 8px.
2. **Smoothing:** corners use a smoothing of 0.6 (60%, Figma's "iOS" preset), matching the Sketch files.
3. **Small radii:** below 8px, use a plain rounded corner; the difference isn't visible at that size.

### Borders, Shadows and Focus Rings

Web squircles are drawn by clipping the element to a smooth path, which also clips anything drawn outside or along its edge. Borders, drop shadows and focus rings on a squircled element must therefore be drawn outside that clip rather than with the platform's own border, shadow and outline styles: by the squircle implementation (Lisse's effects), or as a separate shape around the element (see _Focus.md_). Large, soft drop shadows (such as the elevated shadow) may be drawn from a plain rounded rectangle behind the element, since the difference in shape is invisible under that much blur.

Before the squircle is applied (for example while a server-rendered page is loading), elements fall back to a plain rounded corner of the same radius.
