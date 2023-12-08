/**
 * Select.js
 * 
 * package.json
 * 
 * @file        select.js
 * @version     v0.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,

        // Variables: Configuration
        _configuration = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " "
        },

        // Variables: Elements
        _elements_Type = {},

        // Variables: Attribute Names
        _attribute_Name_Options = "data-select-options";

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() {
        var tagTypes = _configuration.domElementTypes,
            tagTypesLength = tagTypes.length;

        for ( var tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            var domElements = _parameter_Document.getElementsByTagName( tagTypes[ tagTypeIndex ] ),
                elements = [].slice.call( domElements ),
                elementsLength = elements.length;

            for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !renderElement( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function renderElement( element ) {
        var result = true;

        if ( isDefined( element ) && element.hasAttribute( _attribute_Name_Options ) ) {
            var bindingOptionsData = element.getAttribute( _attribute_Name_Options );

            if ( isDefinedString( bindingOptionsData ) ) {
                var bindingOptions = getObjectFromString( bindingOptionsData );

                if ( bindingOptions.parsed && isDefinedObject( bindingOptions.result ) ) {
                    bindingOptions = buildAttributeOptions( bindingOptions.result );

                    if ( bindingOptions.render ) {
                        element.removeAttribute( _attribute_Name_Options );

                        var container = renderContainer( element ),
                            controlElements = renderControl( container, element, bindingOptions );
    
                        renderDropDownItems( controlElements.control, controlElements.dropDown, element );
                        renderSelectedItems( controlElements.control, controlElements.dropDown, element, bindingOptions, false );
                        buildDocumentEvents( controlElements.dropDown );

                        fireCustomTrigger( bindingOptions.onRenderComplete, element );
                    }

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( "The attribute '" + _attribute_Name_Options + "' is not a valid object." );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( "The attribute '" + _attribute_Name_Options + "' has not been set correctly." );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderContainer( element ) {
        var parentNode = element.parentNode,
            parentNodeChildren = parentNode.children,
            parentNodeChildrenLength = parentNodeChildren.length,
            parentNodeNextChild = null,
            findNextChild = false;

        for ( var parentNodeChildIndex = 0; parentNodeChildIndex < parentNodeChildrenLength; parentNodeChildIndex++ ) {
            var parentNodeChild = parentNodeChildren[ parentNodeChildIndex ];

            if ( !findNextChild ) {
                if ( parentNodeChild === element ) {
                    findNextChild = true;
                }

            } else {
                parentNodeNextChild = parentNodeChild;
                break;
            }
        }

        var container = createElement( "div", "select-js" );

        if ( isDefined( parentNodeNextChild ) ) {
            parentNode.insertBefore( container, parentNodeNextChild );
        } else {
            parentNode.appendChild( container );
        }

        parentNode.removeChild( element );

        container.appendChild( element );

        return container;
    }

    function renderControl( container, element, bindingOptions ) {
        var control = createElement( "div", "control" );
        container.appendChild( control );

        var dropDown = createElement( "div", "drop-down" );
        dropDown.style.display = "none";
        container.appendChild( dropDown );

        control.onclick = function( e ) {
            showDropDownMenu( e, control, dropDown, element, bindingOptions );
        };

        return {
            control: control,
            dropDown: dropDown
        };
    }

    function renderDropDownItems( control, dropDown, element, bindingOptions ) {
        var options = element.options,
            optionsLength = options.length,
            multiSelectEnabled = element.hasAttribute( "multiple" );

        dropDown.innerHTML = _string.empty;

        for ( var optionIndex = 0; optionIndex < optionsLength; optionIndex++ ) {
            renderDropDownItem( control, dropDown, element, optionIndex, multiSelectEnabled, bindingOptions );
        }
    }

    function renderDropDownItem( control, dropDown, element, optionIndex, multiSelectEnabled, bindingOptions ) {
        var item = createElement( "div", "item" ),
            option = element.options[ optionIndex ];
            
        item.innerHTML = option.text;
        dropDown.appendChild( item );

        if ( option.selected ) {
            item.className += " selected";
        }

        item.onclick = function( e ) {
            cancelBubble( e );

            if ( !multiSelectEnabled ) {
                var optionsLength = element.options.length;

                for ( var optionResetIndex = 0; optionResetIndex < optionsLength; optionResetIndex++ ) {
                    element.options[ optionResetIndex ].selected = false;
                }
            }

            element.options[ optionIndex ].selected = ! element.options[ optionIndex ].selected;

            if ( element.options[ optionIndex ].selected ) {
                item.className = "item selected";
            } else {
                item.className = "item";
            }

            renderSelectedItems( control, dropDown, element, bindingOptions );

            if ( !multiSelectEnabled ) {
                hideDropDownMenu( dropDown );
            }
        };
    }

    function renderSelectedItems( control, dropDown, element, bindingOptions, callCustomTrigger ) {
        callCustomTrigger = isDefinedBoolean( callCustomTrigger ) ? callCustomTrigger : true;

        var options = element.options,
            optionsLength = options.length,
            optionsSelected = false,
            multiSelectEnabled = element.hasAttribute( "multiple" );

        control.innerHTML = _string.empty;

        for ( var optionIndex = 0; optionIndex < optionsLength; optionIndex++ ) {
            var option = options[ optionIndex ];

            if ( option.selected ) {
                optionsSelected = true;

                renderSelectedItem( control, dropDown, element, optionIndex, multiSelectEnabled, bindingOptions );
            }
        }

        if ( !optionsSelected ) {
            var noItemsSelected = createElement( "div", "no-items-selected" );
            noItemsSelected.innerHTML = "There are no items selected";
            control.appendChild( noItemsSelected );
        }

        if ( callCustomTrigger ) {
            fireCustomTrigger( bindingOptions.onSelectedItemsChanged );
        }
    }

    function renderSelectedItem( control, dropDown, element, optionIndex, multiSelectEnabled, bindingOptions ) {
        var selectedItem = createElement( "div", "selected-item" );
        control.appendChild( selectedItem );

        var selectedItemText = createElement( "span", "text" );
        selectedItemText.innerHTML = element.options[ optionIndex ].text;
        selectedItem.appendChild( selectedItemText );

        if ( multiSelectEnabled ) {
            var removeButton = createElement( "div", "remove" );
            removeButton.innerHTML = bindingOptions.removeText;
            selectedItem.appendChild( removeButton );

            removeButton.onclick = function( e ) {
                cancelBubble( e );
    
                element.options[ optionIndex ].selected = false;
    
                hideDropDownMenu( dropDown );
                renderSelectedItems( control, dropDown, element, bindingOptions );
            };
        }
    }

    function buildDocumentEvents( dropDown ) {
        var hideMenu = function() {
            hideDropDownMenu( dropDown );
        };

        _parameter_Document.body.addEventListener( "click", hideMenu );
        _parameter_Window.addEventListener( "resize", hideMenu );
        _parameter_Window.addEventListener( "click", hideMenu );
    }

    function showDropDownMenu( e, control, dropDown, element, bindingOptions ) {
        setTimeout( function() {
            if ( dropDown !== null && dropDown.style.display !== "block" ) {
                dropDown.style.display = "block";
    
                renderDropDownItems( control, dropDown, element, bindingOptions );
    
            } else {
                hideDropDownMenu( dropDown );
            }
        }, 50 );
    }

    function hideDropDownMenu( dropDown ) {
        if ( dropDown !== null && dropDown.style.display !== "none" ) {
            dropDown.style.display = "none";
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;
        options.render = getDefaultBoolean( options.render, true );
        
        options = buildAttributeOptionStrings( options );

        return buildAttributeOptionCustomTriggers( options );
    }

    function buildAttributeOptionStrings( options ) {
        options.removeText = getDefaultString( options.removeText, "X" );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.onRenderComplete = getDefaultFunction( options.onRenderComplete, null );
        options.onSelectedItemsChanged = getDefaultFunction( options.onSelectedItemsChanged, null );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Validation
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function isDefined( value ) {
        return value !== null && value !== undefined && value !== _string.empty;
    }

    function isDefinedObject( object ) {
        return isDefined( object ) && typeof object === "object";
    }

    function isDefinedBoolean( object ) {
        return isDefined( object ) && typeof object === "boolean";
    }

    function isDefinedString( object ) {
        return isDefined( object ) && typeof object === "string";
    }

    function isDefinedFunction( object ) {
        return isDefined( object ) && typeof object === "function";
    }

    function isDefinedArray( object ) {
        return isDefinedObject( object ) && object instanceof Array;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Element Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createElement( type, className ) {
        var result = null,
            nodeType = type.toLowerCase(),
            isText = nodeType === "text";

        if ( !_elements_Type.hasOwnProperty( nodeType ) ) {
            _elements_Type[ nodeType ] = isText ? _parameter_Document.createTextNode( _string.empty ) : _parameter_Document.createElement( nodeType );
        }

        result = _elements_Type[ nodeType ].cloneNode( false );

        if ( isDefined( className ) ) {
            result.className = className;
        }

        return result;
    }

    function cancelBubble( e ) {
        if ( e !== null ) {
            e.preventDefault();
            e.cancelBubble = true;
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTrigger( triggerFunction ) {
        if ( isDefinedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( arguments, 1 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
    }

    function getDefaultFunction( value, defaultValue ) {
        return isDefinedFunction( value ) ? value : defaultValue;
    }

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultStringOrArray( value, defaultValue ) {
        if ( isDefinedString( value ) ) {
            value = value.split( _string.space );

            if ( value.length === 0 ) {
                value = defaultValue;
            }

        } else {
            value = getDefaultArray( value, defaultValue );
        }

        return value;
    }

    function getObjectFromString( objectString ) {
        var parsed = true,
            result = null;

        try {
            if ( isDefinedString( objectString ) ) {
                result = JSON.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );

                if ( isDefinedFunction( result ) ) {
                    result = result();
                }
                
            } catch ( e2 ) {
                if ( !_configuration.safeMode ) {
                    console.error( "Errors in object: " + e1.message + ", " + e2.message );
                    parsed = false;
                }
                
                result = null;
            }
        }

        return {
            parsed: parsed,
            result: result
        };
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * setConfiguration().
     * 
     * Sets the specific configuration options that should be used.
     * 
     * @public
     * 
     * @param       {Options}   newConfiguration                            All the configuration options that should be set (refer to "Options" documentation for properties).
     * 
     * @returns     {Object}                                                The Select.js class instance.
     */
    this.setConfiguration = function( newOptions ) {
        _configuration = !isDefinedObject( newOptions ) ? {} : newOptions;
        
        buildDefaultConfiguration();

        return this;
    };

    function buildDefaultConfiguration() {
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = getDefaultStringOrArray( _configuration.domElementTypes, [ "select" ] );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getVersion().
     * 
     * Returns the version of Select.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    this.getVersion = function() {
        return "0.1.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Select.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, windowObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$select ) ) {
            _parameter_Window.$select = this;
        }

    } ) ( document, window );
} )();