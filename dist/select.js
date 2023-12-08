/*! Select.js v0.2.0 | (c) Bunoon | MIT License */
(function() {
  function render() {
    var tagTypes = _configuration.domElementTypes;
    var tagTypesLength = tagTypes.length;
    var tagTypeIndex = 0;
    for (; tagTypeIndex < tagTypesLength; tagTypeIndex++) {
      var domElements = _parameter_Document.getElementsByTagName(tagTypes[tagTypeIndex]);
      var elements = [].slice.call(domElements);
      var elementsLength = elements.length;
      var elementIndex = 0;
      for (; elementIndex < elementsLength; elementIndex++) {
        if (!renderElement(elements[elementIndex])) {
          break;
        }
      }
    }
  }
  function renderElement(element) {
    var result = true;
    if (isDefined(element) && element.hasAttribute(_attribute_Name_Options)) {
      var bindingOptionsData = element.getAttribute(_attribute_Name_Options);
      if (isDefinedString(bindingOptionsData)) {
        var bindingOptions = getObjectFromString(bindingOptionsData);
        if (bindingOptions.parsed && isDefinedObject(bindingOptions.result)) {
          bindingOptions = buildAttributeOptions(bindingOptions.result);
          if (bindingOptions.render) {
            element.removeAttribute(_attribute_Name_Options);
            var container = renderContainer(element);
            var controlElements = renderControl(container, element, bindingOptions);
            renderDropDownItems(controlElements);
            renderSelectedItems(controlElements, bindingOptions, false);
            buildDocumentEvents(controlElements, bindingOptions);
            fireCustomTrigger(bindingOptions.onRenderComplete, element);
          }
        } else {
          if (!_configuration.safeMode) {
            console.error("The attribute '" + _attribute_Name_Options + "' is not a valid object.");
            result = false;
          }
        }
      } else {
        if (!_configuration.safeMode) {
          console.error("The attribute '" + _attribute_Name_Options + "' has not been set correctly.");
          result = false;
        }
      }
    }
    return result;
  }
  function renderContainer(element) {
    var parentNode = element.parentNode;
    var parentNodeChildren = parentNode.children;
    var parentNodeChildrenLength = parentNodeChildren.length;
    var parentNodeNextChild = null;
    var findNextChild = false;
    var parentNodeChildIndex = 0;
    for (; parentNodeChildIndex < parentNodeChildrenLength; parentNodeChildIndex++) {
      var parentNodeChild = parentNodeChildren[parentNodeChildIndex];
      if (!findNextChild) {
        if (parentNodeChild === element) {
          findNextChild = true;
        }
      } else {
        parentNodeNextChild = parentNodeChild;
        break;
      }
    }
    var container = createElement("div", "select-js");
    if (isDefined(parentNodeNextChild)) {
      parentNode.insertBefore(container, parentNodeNextChild);
    } else {
      parentNode.appendChild(container);
    }
    parentNode.removeChild(element);
    container.appendChild(element);
    return container;
  }
  function renderControl(container, element, bindingOptions) {
    var control = createElement("div", "control");
    container.appendChild(control);
    var dropDown = createElement("div", "drop-down");
    dropDown.style.display = "none";
    container.appendChild(dropDown);
    if (!bindingOptions.showDropDownButton) {
      control.onclick = function() {
        showDropDownMenu(control, dropDown, element, bindingOptions);
      };
    }
    return {control:control, dropDown:dropDown, select:element};
  }
  function renderControlButton(controlElements, bindingOptions) {
    if (bindingOptions.showDropDownButton) {
      var dropDownButton = createElement("div", "button");
      controlElements.control.appendChild(dropDownButton);
      if (isDropDownMenuVisible(controlElements)) {
        dropDownButton.className += _string.space + "button-open";
      }
      dropDownButton.onclick = function() {
        showDropDownMenu(controlElements, bindingOptions);
      };
    }
  }
  function renderDropDownItems(controlElements, bindingOptions) {
    var options = controlElements.select.options;
    var optionsLength = options.length;
    var multiSelectEnabled = controlElements.select.hasAttribute("multiple");
    controlElements.dropDown.innerHTML = _string.empty;
    var optionIndex = 0;
    for (; optionIndex < optionsLength; optionIndex++) {
      renderDropDownItem(controlElements, optionIndex, multiSelectEnabled, bindingOptions);
    }
  }
  function renderDropDownItem(controlElements, optionIndex, multiSelectEnabled, bindingOptions) {
    var item = createElement("div", "item");
    var option = controlElements.select.options[optionIndex];
    item.innerHTML = option.text;
    controlElements.dropDown.appendChild(item);
    if (option.selected) {
      item.className += " selected";
    }
    item.onclick = function(e) {
      cancelBubble(e);
      if (!multiSelectEnabled) {
        var optionsLength = controlElements.select.options.length;
        var optionResetIndex = 0;
        for (; optionResetIndex < optionsLength; optionResetIndex++) {
          controlElements.select.options[optionResetIndex].selected = false;
        }
      }
      controlElements.select.options[optionIndex].selected = !controlElements.select.options[optionIndex].selected;
      if (controlElements.select.options[optionIndex].selected) {
        item.className = "item selected";
      } else {
        item.className = "item";
      }
      renderSelectedItems(controlElements, bindingOptions);
      if (!multiSelectEnabled) {
        hideDropDownMenu(controlElements, bindingOptions);
      }
    };
  }
  function renderSelectedItems(controlElements, bindingOptions, callCustomTrigger) {
    callCustomTrigger = isDefinedBoolean(callCustomTrigger) ? callCustomTrigger : true;
    var options = controlElements.select.options;
    var optionsLength = options.length;
    var optionsSelected = false;
    var multiSelectEnabled = controlElements.select.hasAttribute("multiple");
    controlElements.control.innerHTML = _string.empty;
    renderControlButton(controlElements, bindingOptions);
    var optionIndex = 0;
    for (; optionIndex < optionsLength; optionIndex++) {
      var option = options[optionIndex];
      if (option.selected) {
        optionsSelected = true;
        renderSelectedItem(controlElements, optionIndex, multiSelectEnabled, bindingOptions);
      }
    }
    if (!optionsSelected) {
      var noItemsSelected = createElement("div", "no-items-selected");
      noItemsSelected.innerHTML = bindingOptions.noItemsSelectedText;
      controlElements.control.appendChild(noItemsSelected);
    }
    if (callCustomTrigger) {
      fireCustomTrigger(bindingOptions.onSelectedItemsChanged);
    }
  }
  function renderSelectedItem(controlElements, optionIndex, multiSelectEnabled, bindingOptions) {
    var selectedItem = createElement("div", "selected-item");
    controlElements.control.appendChild(selectedItem);
    var selectedItemText = createElement("span", "text");
    selectedItemText.innerHTML = controlElements.select.options[optionIndex].text;
    selectedItem.appendChild(selectedItemText);
    if (multiSelectEnabled) {
      var removeButton = createElement("div", "remove");
      removeButton.innerHTML = bindingOptions.removeText;
      selectedItem.appendChild(removeButton);
      removeButton.onclick = function(e) {
        cancelBubble(e);
        controlElements.select.options[optionIndex].selected = false;
        hideDropDownMenu(controlElements, bindingOptions);
        renderSelectedItems(controlElements, bindingOptions);
      };
    }
  }
  function buildDocumentEvents(controlElements, bindingOptions) {
    var hideMenu = function() {
      hideDropDownMenu(controlElements, bindingOptions);
    };
    _parameter_Document.body.addEventListener("click", hideMenu);
    _parameter_Window.addEventListener("resize", hideMenu);
    _parameter_Window.addEventListener("click", hideMenu);
  }
  function showDropDownMenu(controlElements, bindingOptions) {
    if (!isDropDownMenuVisible(controlElements)) {
      setTimeout(function() {
        controlElements.dropDown.style.display = "block";
        renderDropDownItems(controlElements, bindingOptions);
        renderSelectedItems(controlElements, bindingOptions);
      }, bindingOptions.dropDownShowDelay);
    } else {
      hideDropDownMenu(controlElements, bindingOptions);
    }
  }
  function hideDropDownMenu(controlElements, bindingOptions) {
    if (controlElements.dropDown !== null && controlElements.dropDown.style.display !== "none") {
      controlElements.dropDown.style.display = "none";
      renderSelectedItems(controlElements, bindingOptions);
    }
  }
  function isDropDownMenuVisible(controlElements) {
    return controlElements.dropDown !== null && controlElements.dropDown.style.display === "block";
  }
  function buildAttributeOptions(newOptions) {
    var options = !isDefinedObject(newOptions) ? {} : newOptions;
    options.render = getDefaultBoolean(options.render, true);
    options.dropDownShowDelay = getDefaultNumber(options.dropDownShowDelay, 50);
    options.showDropDownButton = getDefaultBoolean(options.showDropDownButton, true);
    options = buildAttributeOptionStrings(options);
    return buildAttributeOptionCustomTriggers(options);
  }
  function buildAttributeOptionStrings(options) {
    options.removeText = getDefaultString(options.removeText, "X");
    options.noItemsSelectedText = getDefaultString(options.noItemsSelectedText, "There are no items selected");
    return options;
  }
  function buildAttributeOptionCustomTriggers(options) {
    options.onRenderComplete = getDefaultFunction(options.onRenderComplete, null);
    options.onSelectedItemsChanged = getDefaultFunction(options.onSelectedItemsChanged, null);
    return options;
  }
  function isDefined(value) {
    return value !== null && value !== undefined && value !== _string.empty;
  }
  function isDefinedObject(object) {
    return isDefined(object) && typeof object === "object";
  }
  function isDefinedBoolean(object) {
    return isDefined(object) && typeof object === "boolean";
  }
  function isDefinedString(object) {
    return isDefined(object) && typeof object === "string";
  }
  function isDefinedFunction(object) {
    return isDefined(object) && typeof object === "function";
  }
  function isDefinedNumber(object) {
    return isDefined(object) && typeof object === "number";
  }
  function isDefinedArray(object) {
    return isDefinedObject(object) && object instanceof Array;
  }
  function createElement(type, className) {
    var result = null;
    var nodeType = type.toLowerCase();
    var isText = nodeType === "text";
    if (!_elements_Type.hasOwnProperty(nodeType)) {
      _elements_Type[nodeType] = isText ? _parameter_Document.createTextNode(_string.empty) : _parameter_Document.createElement(nodeType);
    }
    result = _elements_Type[nodeType].cloneNode(false);
    if (isDefined(className)) {
      result.className = className;
    }
    return result;
  }
  function cancelBubble(e) {
    if (e !== null) {
      e.preventDefault();
      e.cancelBubble = true;
    }
  }
  function fireCustomTrigger(triggerFunction) {
    if (isDefinedFunction(triggerFunction)) {
      triggerFunction.apply(null, [].slice.call(arguments, 1));
    }
  }
  function getDefaultString(value, defaultValue) {
    return isDefinedString(value) ? value : defaultValue;
  }
  function getDefaultBoolean(value, defaultValue) {
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function getDefaultFunction(value, defaultValue) {
    return isDefinedFunction(value) ? value : defaultValue;
  }
  function getDefaultArray(value, defaultValue) {
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getDefaultNumber(value, defaultValue) {
    return isDefinedNumber(value) ? value : defaultValue;
  }
  function getDefaultStringOrArray(value, defaultValue) {
    if (isDefinedString(value)) {
      value = value.split(_string.space);
      if (value.length === 0) {
        value = defaultValue;
      }
    } else {
      value = getDefaultArray(value, defaultValue);
    }
    return value;
  }
  function getObjectFromString(objectString) {
    var parsed = true;
    var result = null;
    try {
      if (isDefinedString(objectString)) {
        result = JSON.parse(objectString);
      }
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
        if (isDefinedFunction(result)) {
          result = result();
        }
      } catch (e2) {
        if (!_configuration.safeMode) {
          console.error("Errors in object: " + e1.message + ", " + e2.message);
          parsed = false;
        }
        result = null;
      }
    }
    return {parsed:parsed, result:result};
  }
  function buildDefaultConfiguration() {
    _configuration.safeMode = getDefaultBoolean(_configuration.safeMode, true);
    _configuration.domElementTypes = getDefaultStringOrArray(_configuration.domElementTypes, ["select"]);
  }
  var _parameter_Document = null;
  var _parameter_Window = null;
  var _configuration = {};
  var _string = {empty:"", space:" "};
  var _elements_Type = {};
  var _attribute_Name_Options = "data-select-options";
  this.setConfiguration = function(newOptions) {
    _configuration = !isDefinedObject(newOptions) ? {} : newOptions;
    buildDefaultConfiguration();
    return this;
  };
  this.getVersion = function() {
    return "0.2.0";
  };
  (function(documentObject, windowObject) {
    _parameter_Document = documentObject;
    _parameter_Window = windowObject;
    buildDefaultConfiguration();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      render();
    });
    if (!isDefined(_parameter_Window.$select)) {
      _parameter_Window.$select = this;
    }
  })(document, window);
})();