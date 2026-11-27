# Modals

Modals in Oganesson come in two flavors, dialog and sheet, each of which designed for a different purpose.

## Dialog Modals

Dialog modals are used to quickly capture the user's attention for an immediate alert or action confirmation. They are small, direct to the point and contain very few actions. The most common use-case for a dialog modal is to confirm a dangerous, destructive or major action.

Dialog modals must contain a title and a short, 1-2 setence description. They will typically also contain a primary/confirmation action to the right, and a secondary/cancellation action to the left. The title should typically explain the entire purpose of the modal in 3-5 words (e.g. "Confirm Account Deletion"). The description should be a longer but still succinct explanation of the ramifications of this action.

Dialog modals purposefully use the system Acrylic style, allowing blurred content from behind them through. This is to show to users that the action is transient.

In most cases, the system should focus the secondary/cancellation action by default but allow the user to use "Tab" or the arrow keys to navigate to the primary/confirmation action.

Where the operating system offers a system-native dialog modal (e.g. iOS' dialog menu), Oganesson should use it instead. The web offers no such dialog, so web implementations always draw their own.

### Dialog Layout

_See also: Dialog Modal.sketchframe_

A dialog modal is 400px wide and as tall as its content, with smooth 22px corners and 16px of padding, and 16px between its three rows:

1. **Header:** the title (Title style) beside a subtle close button in the top-right corner. The close button does the same as the cancellation action. Dialogs with no default cancellation can leave it out.
2. **Description:** in the Label style.
3. **Actions:** aligned to the right, 8px apart: the subtle cancellation action, then the prominent confirmation action.

The dialog uses the elevated Acrylic style: Background 2 (Acrylic) with a 10px background blur, the elevated drop shadow and a white inner highlight (1px down, 6px blur), like menus. The arrow keys move between its actions in either direction, wrapping at the ends.

## Sheet Modals

Sheet modals are used to bring the user's focus to a longer flow, typically a short-to-medium-length form or to enlarge details from the page beneath them. Sheet modals are designed to contain Oganesson forms.

Sheet forms have a fixed width and height set by the developer ahead of time. Content taller than the sheet should scroll beneath the header and footer. Where the viewport is shorter or thinner than the modal, a 16px blank space region should be left between the modal's body and the edges of the screen.

Sheet forms typically offer up to three actions along the footer:

1. **Primary action:** the rightmost button, which should almost always be present. Used for things like saving and closing the form, or moving to the next page in a multi-step form.
2. **Secondary action:** typically only used in multi-step forms to go back to the previous page, this button lives immediately to the left of the primary aciton.
3. **Tertiary/cancellation action:** typically used to close the form without saving any changes, positioned as the leftmost item in the modal. Functionally this should be the same as clicking the "X" button in the top-right.

Sheet modals may also be used to display static content, in which case the actions/footer row is often not necessary.

### Sheet Layout

_See also: Sheet Modal.sketchframe_

A sheet has smooth 22px corners, a Background 1 fill, the elevated drop shadow and the white inner highlight. Its header and footer are 62px bars (16px of padding around 30px controls) laid over the content, each with the scroll edge effect (see _Scroll Edge Effect.md_) facing the content:

1. **Header:** the title (Title style), with a subtle close button in the top-right corner, 16px apart.
2. **Content:** 16px from the sides of the sheet, starting below the header and able to scroll clear of the footer. Without a footer, the content ends 16px from the bottom. The content's scrollbar runs between the header and footer rather than under them, and a control scrolled into view (for example by Tab) stops clear of both bars.
3. **Footer:** the tertiary action on the far left, then the secondary and primary actions on the right, 8px apart.

When a sheet opens, the first control in its content takes focus. If there is none, static content that scrolls takes focus so the keyboard can scroll it; otherwise the sheet itself does, so no control shows a focus ring until the keyboard moves. Focus then moves through the content, the footer actions from left to right, and the close button, and stays within the sheet.

---

## Interaction Design

### The Background

Behind either type of modal, the page is dimmed with 23.9% black (`rgba(0,0,0,0.239)`). Behind a sheet modal it is also blurred by 8px; behind a dialog modal it isn't blurred. Modals sit above the page but below menus, select menus and tooltips, so those opened from inside a modal show above it.

### Pressing the Background

By default, a modal will close when a user presses the background behind a modal, with the standard cancellation or "close without action" event firing. It should be noted, however, that accidentally clicking the background is a common occurrence, so developers may choose to disable this feature if:

- A dialog modal offers no default cancellation action, or cancelling an action has ramifications.
- A sheet modal contains a form where losing progress would be irritating to the user.

### Closing on "Escape"

By default, modals use the same behaviour for closing on "Escape" key press as when pressing on the background. In most cases, the same design considerations are valid for this interaction as for closing on background press, so it is recommended to let the system keep the two in step.

### Motion

Modals use the menu motion (see _Animations.md — Menu Motion_), scaled from their centre: they grow from 95% scale and sharpen from a 4px blur while fading in over 200ms (a cubic ease-out), and shrink, blur and fade back out over 150ms (a cubic ease-in-out). The dimmed background, and its blur behind a sheet, fades in over 200ms (`ease-out`) and out over 300ms (the interaction fade-out curve), so it never snaps into or out of view. Animate the blur itself from none, not only the background's opacity: WebKit doesn't fade a backdrop blur with its element's opacity. As with menus, apply the fade and blur to the modal's surface and anything drawn beside it, never to an ancestor of the surface, or the acrylic stops blurring the page behind it.
