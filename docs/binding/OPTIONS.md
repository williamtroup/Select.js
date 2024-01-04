# Select.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-select-options" binding attribute for a DOM element.


### Standard Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | render | States if the element should be rendered (defaults to true). |
| *number* | dropDownShowDelay | States the milliseconds that it should wait before showing the drop-down menu (defaults to 50). |
| *boolean* | showDropDownButton | States if a opening/closing button should be used for showing the drop-down menu (defaults to true). |
<br/>


### Translatable String Options:
<br/>

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | removeText | The text that should be shown for the remove button (defaults to "X".) |
| *string* | noItemsSelectedText | The text that should be shown when no items are selected (defaults to "There are no items selected"). |

<br>


## Binding Example:

```markdown
<select multiple="multiple" data-select-options="{ 'render': true }">
    <option value="1" selected="selected">Value 1</option>
    <option value="2">Value 2</option>
    <option value="2">Value 3</option>
</select>
```