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
        _parameter_Navigator = null,
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
        _elements = [],

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
                    bindingOptions = bindingOptions[ 1 ];

                    element.removeAttribute( _attribute_Name_Options );

                    var container = renderContainer( element );
                        controlElements = renderControl( container );

                    renderDropDownItems( controlElements[ 0 ], controlElements[ 1 ], element );
                    renderSelectedItems( controlElements[ 0 ], element.options );
                    buildDocumentEvents( controlElements[ 0 ], controlElements[ 1 ], element );

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

    function renderControl( container ) {
        var control = createElement( "div", "control" );
        container.appendChild( control );

        var dropDown = createElement( "div", "drop-down" );
        container.appendChild( dropDown );

        return [ control, dropDown ];
    }

    function renderDropDownItems( control, dropDown, element ) {
        var options = element.options,
            optionsLength = options.length;

        for ( var optionIndex = 0; optionIndex < optionsLength; optionIndex++ ) {
            var option = options[ optionIndex ];

            renderDropDownItem( dropDown, options, option.text, option.selected, optionIndex );
        }
    }

    function renderDropDownItem( dropDown, options, text, selected, optionIndex ) {
        var item = createElement( "div", "item" );
        item.innerHTML = text;
        dropDown.appendChild( item );

        if ( selected ) {
            item.className += " selected";
        }

        item.onclick = function( e ) {
            cancelBubble( e );

            options[ optionIndex ].selected = !options[ optionIndex ].selected;

            if ( options[ optionIndex ].selected ) {
                item.className = "item selected";
            } else {
                item.className = "item";
            }

            renderSelectedItems( control, options );
        };
    }

    function renderSelectedItems( control, options ) {
        var optionsLength = options.length,
            optionsSelected = false;

        control.innerHTML = _string.empty;

        for ( var optionIndex = 0; optionIndex < optionsLength; optionIndex++ ) {
            var option = options[ optionIndex ];

            if ( option.selected ) {
                optionsSelected = true;

                var selectedItem = createElement( "div", "selected-item" );
                control.appendChild( selectedItem );

                var selectedItemText = createElement( "span", "text" );
                selectedItemText.innerHTML = option.text;
                selectedItem.appendChild( selectedItemText );

                var removeButton = createElement( "div", "remove" );
                removeButton.innerHTML = "X";
                selectedItem.appendChild( removeButton );
            }
        }

        if ( !optionsSelected ) {
            var noItemsSelected = createElement( "div", "no-items-selected" );
            noItemsSelected.innerHTML = "There are no items selected";
            control.appendChild( noItemsSelected );
        }
    }

    function buildDocumentEvents( control, dropDown, element ) {
        var hideMenu = function() {
            hideDropDownMenu( control, dropDown, element.options );
        };

        _parameter_Document.body.addEventListener( "click", hideMenu );
        _parameter_Window.addEventListener( "resize", hideMenu );
        _parameter_Window.addEventListener( "click", hideMenu );
    }

    function hideDropDownMenu( control, dropDown, options ) {
        if ( dropDown !== null && dropDown.style.display !== "none" ) {
            dropDown.style.display = "none";

            renderSelectedItems( control, options );
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

    function getClonedObject( object ) {
        var json = JSON.stringify( object ),
            result = JSON.parse( json );

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * String Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function newGuid() {
        var result = [];

        for ( var charIndex = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( "-" );
            }

            var character = Math.floor( Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( _string.empty );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Destroying
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * destroyAll().
     * 
     * Reverts all rendered elements back to their original state (without render attributes).
     * 
     * @public
     * 
     * @returns     {Object}                                                The Select.js class instance.
     */
    this.destroyAll = function() {
        return this;
    };

    /**
     * destroy().
     * 
     * Reverts an element back to its original state (without render attributes).
     * 
     * @public
     * 
     * @param       {string}    elementId                                   The ID of the DOM element to destroy.
     * 
     * @returns     {Object}                                                The Select.js class instance.
     */
    this.destroy = function( elementId ) {
        return this;
    };


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

    ( function ( documentObject, navigatorObject, windowObject ) {
        _parameter_Document = documentObject;
        _parameter_Navigator = navigatorObject;
        _parameter_Window = windowObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$select ) ) {
            _parameter_Window.$select = this;
        }

    } ) ( document, navigator, window );
} )();