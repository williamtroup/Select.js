# Select.js - Change Log:

## Version 0.3.0:
- Added PACK.sh and PUBLISH.sh files for quickly packing and publishing the project.
- Documentation improvements.
- Fixed documentation header in the main "src/select.js" file.
- 

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