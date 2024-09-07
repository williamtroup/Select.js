# Select.js - Binding Options - Custom Triggers:

Below is a list of all the custom triggers supported in the "data-select-js" binding attribute for DOM elements.
<br>
<br>


<h1>For Rendering:</h1>

### options.events.onRenderComplete( *element* ):
Fires when the rendering for a a DOM element is complete.
<br>
***Parameter:*** element: '*object*' - The DOM element that was rendered.


<br>
<h1>For Item Selections:</h1>

### options.events.onSelectedItemsChanged( *values* ):
Fires when the selected items have changed.
<br>
***Parameter:*** values: '*string[]*' - The values that have been selected.


<br>
<h1>For Drop-Down Showing/Hiding:</h1>

### options.events.onDropDownShow():
Fires when the drop-down menu is shown.

### options.events.onDropDownHide():
Fires when the drop-down menu is hidden.

<br>


## Binding Example:

```markdown
<select multiple="multiple" data-select-js="{ 'events': { 'onRenderComplete': yourJsFunction } }">
    <option value="1" selected="selected">Value 1</option>
    <option value="2">Value 2</option>
    <option value="2">Value 3</option>
</select>
```