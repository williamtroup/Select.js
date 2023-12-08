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

                if ( bindingOptions[ 0 ] && isDefinedObject( bindingOptions[ 1 ] ) ) {
                    bindingOptions = buildAttributeOptions( bindingOptions[ 1 ] );

                    if ( bindingOptions.render ) {
                        element.removeAttribute( _attribute_Name_Options );

                        var container = renderContainer( element ),
                            controlElements = renderControl( container, element );
    
                        renderDropDownItems( controlElements[ 0 ], controlElements[ 1 ], element );
                        renderSelectedItems( controlElements[ 0 ], controlElements[ 1 ], element.options );
                        buildDocumentEvents( controlElements[ 1 ] );
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

    function renderControl( container, element ) {
        var control = createElement( "div", "control" );
        container.appendChild( control );

        var dropDown = createElement( "div", "drop-down" );
        dropDown.style.display = "none";
        container.appendChild( dropDown );

        control.onclick = function( e ) {
            showDropDownMenu( e, control, dropDown, element );
        };

        return [ control, dropDown ];
    }

    function renderDropDownItems( control, dropDown, element ) {
        var options = element.options,
            optionsLength = options.length;

        dropDown.innerHTML = _string.empty;

        for ( var optionIndex = 0; optionIndex < optionsLength; optionIndex++ ) {
            renderDropDownItem( control, dropDown, element, optionIndex );
        }
    }

    function renderDropDownItem( control, dropDown, element, optionIndex ) {
        var item = createElement( "div", "item" ),
            option = element.options[ optionIndex ];
            
        item.innerHTML = option.text;
        dropDown.appendChild( item );

        if ( option.selected ) {
            item.className += " selected";
        }

        item.onclick = function( e ) {
            cancelBubble( e );

            element.options[ optionIndex ].selected = ! element.options[ optionIndex ].selected;

            if (  element.options[ optionIndex ].selected ) {
                item.className = "item selected";
            } else {
                item.className = "item";
            }

            renderSelectedItems( control, dropDown, element.options );
        };
    }

    function renderSelectedItems( control, dropDown, options ) {
        var optionsLength = options.length,
            optionsSelected = false;

        control.innerHTML = _string.empty;

        for ( var optionIndex = 0; optionIndex < optionsLength; optionIndex++ ) {
            var option = options[ optionIndex ];

            if ( option.selected ) {
                optionsSelected = true;

                renderSelectedItem( control, dropDown, options, optionIndex );
            }
        }

        if ( !optionsSelected ) {
            var noItemsSelected = createElement( "div", "no-items-selected" );
            noItemsSelected.innerHTML = "There are no items selected";
            control.appendChild( noItemsSelected );
        }
    }

    function renderSelectedItem( control, dropDown, options, optionIndex ) {
        var selectedItem = createElement( "div", "selected-item" );
        control.appendChild( selectedItem );

        var selectedItemText = createElement( "span", "text" );
        selectedItemText.innerHTML = options[ optionIndex ].text;
        selectedItem.appendChild( selectedItemText );

        var removeButton = createElement( "div", "remove" );
        removeButton.innerHTML = "X";
        selectedItem.appendChild( removeButton );

        removeButton.onclick = function( e ) {
            cancelBubble( e );

            options[ optionIndex ].selected = false;

            hideDropDownMenu( dropDown );
            renderSelectedItems( control, dropDown, options );
        };
    }

    function buildDocumentEvents( dropDown ) {
        var hideMenu = function() {
            hideDropDownMenu( dropDown );
        };

        _parameter_Document.body.addEventListener( "click", hideMenu );
        _parameter_Window.addEventListener( "resize", hideMenu );
        _parameter_Window.addEventListener( "click", hideMenu );
    }

    function showDropDownMenu( e, control, dropDown, element ) {
        cancelBubble( e );

        if ( dropDown !== null && dropDown.style.display !== "block" ) {
            dropDown.style.display = "block";

            renderDropDownItems( control, dropDown, element );
        }
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
        options.copyButtonText = getDefaultString( options.copyButtonText, "Copy" );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.onCopy = getDefaultFunction( options.onCopy, null );

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

    function isDefinedNumber( object ) {
        return isDefined( object ) && typeof object === "number";
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

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
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

        return [ parsed, result ];
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