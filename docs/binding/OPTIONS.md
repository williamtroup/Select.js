# Select.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-select-js" binding attribute for a DOM element.
<br>
<br>


### Standard Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | render | States if the element should be rendered (defaults to true). |
| *number* | dropDownShowDelay | States the milliseconds that it should wait before showing the drop-down menu (defaults to 50). |
| *boolean* | showDropDownButton | States if a opening/closing button should be used for showing the drop-down menu (defaults to true). |

<br/>


### String Options:

| Category: | Type: | Name: | Description: |
| --- | --- | --- | --- |
| text | *string* | removeText | The text that should be shown for the remove button (defaults to "✖".) |
| text | *string* | noItemsSelectedText | The text that should be shown when no items are selected (defaults to "There are no items selected"). |

<br>


## Binding Example:

```markdown
<select multiple="multiple" data-select-js="{ 'render': true }">
    <option value="1" selected="selected">Value 1</option>
    <option value="2">Value 2</option>
    <option value="2">Value 3</option>
</select>
```