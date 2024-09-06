# Select.js v1.0.0

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Select.js%2C%20a%20free%20JavaScript%select%builder&url=https://github.com/williamtroup/Select.js&hashtags=javascript,html,select)
[![npm](https://img.shields.io/badge/npmjs-v1.0.0-blue)](https://www.npmjs.com/package/jselect.js)
[![nuget](https://img.shields.io/badge/nuget-v1.0.0-purple)](https://www.nuget.org/packages/jSelect.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/Select.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/Select.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://github.com/williamtroup)

> A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!


## What features does Select.js have?

- Zero-dependencies and extremely lightweight!
- Maintains existing SELECT DOM element for FORM compatibility.
- Full API available via public functions.
- Fully styled in CSS/SASS (including the buttons) and compatible with the Bootstrap library.
- Full CSS theme support (using :root variables, with a default dark-mode theme).
- Custom triggers for actions (when elements are rendered, selection is changed, etc).
- Shortcut keys (click [here](https://github.com/williamtroup/docs/SHORTCUT_KEYS.md) to see the full list).


## What browsers are supported?

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.


## What are the most recent changes?

To see a list of all the most recent changes, click [here](https://github.com/williamtroup/Select.js/blob/main/docs/CHANGE_LOG.md).


## How do I install Select.js?

You can install the library with npm into your local modules directory using the following command:

```markdown
npm install jselect.js
```


## How do I get started?

To get started using Select.js, do the following steps:

### 1. Prerequisites:

Make sure you include the "DOCTYPE html" tag at the top of your HTML, as follows:

```markdown
<!DOCTYPE html>
```

### 2. Include Files:

```markdown
<link rel="stylesheet" href="dist/select.js.css" />
<script src="dist/select.js"></script>
```

### 3. DOM Element Binding:

```markdown
<select multiple="multiple" data-select-options="{ 'render': true }">
    <option value="1" selected="selected">Value 1</option>
    <option value="2">Value 2</option>
    <option value="2">Value 3</option>
</select>

<select data-select-options="{ 'render': true }">
    <option value="1">Value 1</option>
    <option value="2">Value 2</option>
    <option value="2">Value 3</option>
</select>
```

To see a list of all the available binding options you can use for "data-select-options", click [here](https://github.com/williamtroup/Select.js/blob/main/docs/binding/OPTIONS.md).

To see a list of all the available custom triggers you can use for "data-select-options", click [here](https://github.com/williamtroup/Select.js/blob/main/docs/binding/CUSTOM_TRIGGERS.md).


### 4. Finishing Up:

That's it! Nice and simple. Please refer to the code if you need more help (fully documented).


## How do I go about customizing Select.js?

To customize, and get more out of Select.js, please read through the following documentation.


### 1. Public Functions:

To see a list of all the public functions available, click [here](https://github.com/williamtroup/Select.js/blob/main/docs/PUBLIC_FUNCTIONS.md).


### 2. Configuration:

Configuration options allow you to customize how Select.js will function.  You can set them as follows:

```markdown
<script> 
  $select.setConfiguration( {
      safeMode: false
  } );
</script>
```

To see a list of all the available configuration options you can use, click [here](https://github.com/williamtroup/Select.js/blob/main/docs/configuration/OPTIONS.md).