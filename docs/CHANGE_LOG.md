# Select.js - Change Log:

## Version 0.5.0:

#### **CSS:**
- Added a new ":root" variable called "--select-js-default-font".

#### **Documentation:**
- Documentation layout improvements.

<br>


## Version 0.4.0:
- BREAKING: All ":root" variables now start with "--select-js-", which will prevent collisions with other libraries.
- Updated project homepage URL.

<br>


## Version 0.3.0:

#### **Binding Options - Custom Triggers:**
- Added a new binding custom trigger called "onDropDownShow", which states an event that should be triggered when the drop-down menu is shown.
- Added a new binding custom trigger called "onDropDownHide", which states an event that should be triggered when the drop-down menu is hidden.

#### **General Improvements:**
- Pressing escape in the document will close all opened drop-down menus.

#### **Documentation:**
- Added examples to all documentation areas.
- Reorganized the documentation for the project.

#### **CSS:**
- Added an ":active" CSS state for the drop-down arrow.

<br>


## Version 0.2.3:
- Fixed mistakes in the Security Policy.
- Added Code of Conduct and Contributing.

<br>


## Version 0.2.2:
- Documentation improvements.
- Fixed the PACK.sh file pointing at the wrong filename.

<br>


## Version 0.2.1:
- Added PACK.sh and PUBLISH.sh files for quickly packing and publishing the project.
- Documentation improvements.
- Fixed documentation header in the main "src/select.js" file.

<br>


## Version 0.2.0:

#### **Library:**
- Added full Bootstrap support!

#### **Binding Options:**
- Added a new binding option "dropDownShowDelay" (defaults to 50), which states the millisecond that it should wait before showing the drop-down menu.
- Added a new binding option "showDropDownButton" (defaults to true), which states if an opening/closing button should be used for showing the drop-down menu.
- Added a new binding option "noItemsSelectedText" (defaults to "There are no items selected"), which states the message to show when no items are selected.

#### **Binding Options - Custom Triggers:**
- The binding option custom trigger "onSelectedItemsChanged" now has all the values selected passed to it.

#### **General Improvements:**
- Internal cleanups to make passing DOM element objects around a bit easier.
- Adding new testing files to verify with Bootstrap.

#### **Fixes:**
- Fixed a fault that caused the drop-down menu to remain open when clicking in the main control again.
- Fixed missing scrolling support for the drop-down menu.

<br>


## Version 0.1.0:
- Everything :)