# Forms

Oganesson's forms module allows the assembly of forms by grouping inputs and fields. Forms are best used when users are entering or modifying medium-to-large amounts of information in the system. Short flows like user authentication probably do not need forms.

_See also: Form Exploration.sketchframe_

## Fields

Form _fields_ are the default display state for an input within a form. All fields must be within at least one form group.

In most instances, the label and description of a field should be to the left of the field. Labels must always be present, and descriptions may be used to convey further information about this field's purpose where the label and placeholder alone do not explain it. On thin or mobile devices, the system should move the label and description to be above the input.

Where a field contains inputs like select or text inputs, the label and the input should take up equal space in the row. For fixed-width inputs like a switch, the label should expand to fill the space.

Required fields should display a small red asterisk immediately to the right of their label.

Fields may optionally contain an icon that can be used to identify or beautify the field. Where an icon is in use, the input contained within the field should not have an icon. Forms should not have fields that use icons interchangeably: in a given, all fields must contain an icon, or none should.

On wide layouts the label and description sit 4px in from the group's edge. Without a description, the label is centred vertically on the input; with one, the row aligns to the top and the label sits 4px down so it lines up with the input's text. An icon sits 8px before the label and lines up with it.

When a field is narrower than 400px (on phones, or inside a narrow sheet), the label and description move above the input, 8px apart, and the input takes the field's full width. Fixed-width inputs such as a switch stay to the right of their label at every width. Implementations should respond to the field's own width (a container query) rather than the viewport's, so a form adapts wherever it's placed.

_See also: Forms-Form Field.sketchframe_

## Groups

Form _groups_ are used to group logically or functionally similar fields together. Forms should have at least one group, and can have as many as the developer sees fit.

Sometimes a developer may wish to include a title to identify that group. This title should only be a few words long. The first group in a form should almost never contain a title, as this is assumed to be "general" information about an entity.

_See also: Form Exploration.sketchframe_

Form groups may contain both form fields and display-only content that may be used to help convey the value or output of the fields that group contains.

A group's body has a Background 2 (Acrylic) fill, 16px smooth corners and 8px of padding, with 8px between the items it contains. Adjacent fields are separated by a 1px Dark Thick Glass line, 8px from each; other content is not separated automatically. A group's title is a Subtitle, 4px above the body, and names the group for assistive technology. Groups are 16px apart.

## Forms

A form is at least 300px and at most 650px wide. All fields and buttons within a form must be contained within at least one form group.
