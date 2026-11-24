# Modals

Modals in Oganesson come in two flavors, dialog and sheet, each of which designed for a different purpose.

## Dialog Modals

Dialog modals are used to quickly capture the user's attention for an immediate alert or action confirmation. They are small, direct to the point and contain very few actions. The most common use-case for a dialog modal is to confirm a dangerous, destructive or major action.

Dialog modals must contain a title and a short, 1-2 setence description. They will typically also contain a primary/confirmation action to the right, and a secondary/cancellation action to the left. The title should typically explain the entire purpose of the modal in 3-5 words (e.g. "Confirm Account Deletion"). The description should be a longer but still succinct explanation of the ramifications of this action.

Dialog modals purposefully use the system Acrylic style, allowing blurred content from behind them through. This is to show to users that the action is transient.

In most cases, the system should focus the secondary/cancellation action by default but allow the user to use "Tab" or the arrow keys to navigate to the primary/confirmation action.

Where the operating system offers a system-native dialog modal (e.g. iOS' dialog menu), Oganesson should use it instead.

## Sheet Modals

Sheet modals are used to bring the user's focus to a longer flow, typically a short-to-medium-length form or to enlarge details from the page beneath them. Sheet modals are designed to contain Oganesson forms.

Sheet forms have a fixed width and height set by the developer ahead of time. Content taller than the sheet should scroll beneath the header and footer. Where the viewport is shorter or thinner than the modal, a 16px blank space region should be left between the modal's body and the edges of the screen.

Sheet forms typically offer up to three actions along the footer:

1. **Primary action:** the rightmost button, which should almost always be present. Used for things like saving and closing the form, or moving to the next page in a multi-step form.
2. **Secondary action:** typically only used in multi-step forms to go back to the previous page, this button lives immediately to the left of the primary aciton.
3. **Tertiary/cancellation action:** typically used to close the form without saving any changes, positioned as the leftmost item in the modal. Functionally this should be the same as clicking the "X" button in the top-right.

Sheet modals may also be used to display static content, in which case the actions/footer row is often not necessary.

---

## Interaction Design

### Pressing the Background

By default, a modal will close when a user presses the background behind a modal, with the standard cancellation or "close without action" event firing. It should be noted, however, that accidentally clicking the background is a common occurrence, so developers may choose to disable this feature if:

- A dialog modal offers no default cancellation action, or cancelling an action has ramifications.
- A sheet modal contains a form where losing progress would be irritating to the user.

### Closing on "Escape"

By default, modals use the same behaviour for closing on "Escape" key press as when pressing on the background. In most cases, the same design considerations are valid for this interaction as for closing on background press, so it is recommended to let the system keep the two in step.
