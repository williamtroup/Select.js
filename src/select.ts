/**
 * Select.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!
 * 
 * @file        select.ts
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


import {
    type BindingOptions,
    type ControlElement,
    type StringToJson,
    type Configuration } from "./ts/type";

import { type PublicApi } from "./ts/api";
import { Trigger } from "./ts/area/trigger";
import { Constants } from "./ts/constant";
import { Default } from "./ts/data/default";
import { Char, KeyCode } from "./ts/data/enum";
import { Is } from "./ts/data/is";
import { DomElement } from "./ts/dom/dom";
import { Binding } from "./ts/options/binding";
import { Config } from "./ts/options/config";


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Control Elements
    let _control_Elements: ControlElement[] = [];


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() : void {
        const tagTypes: string[] = _configuration.domElementTypes as string[];
        const tagTypesLength: number = tagTypes.length;

        for ( let tagTypeIndex: number = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            const domElements: HTMLCollectionOf<Element> = document.getElementsByTagName( tagTypes[ tagTypeIndex ] );
            const elements: any[] = [].slice.call( domElements );
            const elementsLength: number = elements.length;

            for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !renderElement( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function renderElement( element: HTMLSelectElement ) : boolean {
        let result: boolean = true;

        if ( Is.defined( element ) && element.hasAttribute( Constants.SELECT_JS_ATTRIBUTE_NAME ) ) {
            const bindingOptionsData: string = element.getAttribute( Constants.SELECT_JS_ATTRIBUTE_NAME )!;

            if ( Is.definedString( bindingOptionsData ) ) {
                const bindingData: StringToJson = Default.getObjectFromString( bindingOptionsData, _configuration );

                if ( bindingData.parsed && Is.definedObject( bindingData.object ) ) {
                    const bindingOptions: BindingOptions = Binding.Options.getForNewInstance( bindingData.object, element )

                    if ( bindingOptions.render ) {
                        element.removeAttribute( Constants.SELECT_JS_ATTRIBUTE_NAME );

                        const container: HTMLElement = renderContainer( element );
                        const controlElements: ControlElement = renderControl( container, element, bindingOptions );
    
                        renderDropDownItems( controlElements );
                        renderSelectedItems( controlElements, false );
                        buildDocumentEvents( controlElements );

                        Trigger.customEvent( bindingOptions.events!.onRenderComplete!, bindingOptions._currentView.element );
                    }

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( `The attribute '${Constants.SELECT_JS_ATTRIBUTE_NAME}' is not a valid object.` );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( `The attribute '${Constants.SELECT_JS_ATTRIBUTE_NAME}' has not been set correctly.` );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderContainer( element: HTMLElement ) : HTMLElement {
        const parentNode: ParentNode = element.parentNode!;
        const parentNodeChildren: HTMLCollection = parentNode!.children;
        const parentNodeChildrenLength: number = parentNodeChildren.length;
        let parentNodeNextChild: Element = null!;
        let findNextChild: boolean = false;

        for ( let parentNodeChildIndex: number = 0; parentNodeChildIndex < parentNodeChildrenLength; parentNodeChildIndex++ ) {
            const parentNodeChild: Element = parentNodeChildren[ parentNodeChildIndex ];

            if ( !findNextChild ) {
                if ( parentNodeChild === element ) {
                    findNextChild = true;
                }

            } else {
                parentNodeNextChild = parentNodeChild;
                break;
            }
        }

        const container: HTMLElement = DomElement.create( "div", "select-js" );

        if ( Is.defined( parentNodeNextChild ) ) {
            parentNode.insertBefore( container, parentNodeNextChild );
        } else {
            parentNode.appendChild( container );
        }

        parentNode.removeChild( element );
        container.appendChild( element );

        return container;
    }

    function renderControl( container: HTMLElement, element: HTMLSelectElement, bindingOptions: BindingOptions ) : ControlElement {
        const control: HTMLElement = DomElement.create( "div", "control" );
        container.appendChild( control );

        const dropDown: HTMLElement = DomElement.create( "div", "drop-down" );
        dropDown.style.display = "none";
        container.appendChild( dropDown );

        const controlElement: ControlElement = {    
            control: control,
            dropDown: dropDown,
            select: element,
            bindingOptions: bindingOptions,
            multiSelectEnabled: element.hasAttribute( "multiple" )
        };

        if ( !bindingOptions.showDropDownButton ) {
            control.onclick = () => showDropDownMenu( controlElement );
        }

        _control_Elements.push( controlElement );

        return controlElement;
    }

    function renderControlButton( controlElement: ControlElement ) : void {
        if ( controlElement.bindingOptions.showDropDownButton ) {
            const dropDownButton: HTMLElement = DomElement.create( "div", "button" );
            controlElement.control.appendChild( dropDownButton );

            if ( isDropDownMenuVisible( controlElement ) ) {
                dropDownButton.classList.add( "button-open" );
            }

            dropDownButton.onclick = () => showDropDownMenu( controlElement );
        }
    }

    function renderDropDownItems( controlElement: ControlElement ) : void {
        const options: HTMLOptionsCollection = controlElement.select.options;
        const optionsLength: number = options.length;

        controlElement.dropDown.innerHTML = Char.empty;

        for ( let optionIndex: number = 0; optionIndex < optionsLength; optionIndex++ ) {
            renderDropDownItem( controlElement, optionIndex );
        }
    }

    function renderDropDownItem( controlElement: ControlElement, optionIndex: number ) : void {
        const item: HTMLElement = DomElement.create( "div", "item" );
        const option: HTMLOptionElement = controlElement.select.options[ optionIndex ];
            
        item.innerHTML = option.text;
        controlElement.dropDown.appendChild( item );

        if ( option.selected ) {
            item.classList.add( "selected" );
        }

        item.onclick = ( e: MouseEvent ) => {
            DomElement.cancelBubble( e );

            if ( !controlElement.multiSelectEnabled ) {
                const optionsLength: number = controlElement.select.options.length;

                for ( let optionResetIndex: number = 0; optionResetIndex < optionsLength; optionResetIndex++ ) {
                    controlElement.select.options[ optionResetIndex ].selected = false;
                }
            }

            controlElement.select.options[ optionIndex ].selected = ! controlElement.select.options[ optionIndex ].selected;

            if ( controlElement.select.options[ optionIndex ].selected ) {
                item.className = "item selected";
            } else {
                item.className = "item";
            }

            renderSelectedItems( controlElement );

            if ( !controlElement.multiSelectEnabled ) {
                hideDropDownMenu( controlElement );
            }
        };
    }

    function renderSelectedItems( controlElement: ControlElement, callCustomTrigger: boolean = true ) : void {
        const options: HTMLOptionsCollection = controlElement.select.options;
        const optionsLength: number = options.length;
        let optionsSelected: boolean = false;

        controlElement.control.innerHTML = Char.empty;

        renderControlButton( controlElement );

        for ( let optionIndex: number = 0; optionIndex < optionsLength; optionIndex++ ) {
            const option: HTMLOptionElement = options[ optionIndex ];

            if ( option.selected ) {
                optionsSelected = true;

                renderSelectedItem( controlElement, optionIndex );
            }
        }

        if ( !optionsSelected ) {
            const noItemsSelected: HTMLElement = DomElement.create( "div", "no-items-selected" );
            noItemsSelected.innerHTML = controlElement.bindingOptions.text!.noItemsSelectedText!;
            controlElement.control.appendChild( noItemsSelected );
        }

        if ( callCustomTrigger ) {
            Trigger.customEvent( controlElement.bindingOptions.events!.onSelectedItemsChanged!, getValuesSelected( controlElement ) );
        }
    }

    function renderSelectedItem( controlElement: ControlElement, optionIndex: number ) : void {
        const selectedItem: HTMLElement = DomElement.create( "div", "selected-item" );
        controlElement.control.appendChild( selectedItem );

        const selectedItemText: HTMLElement = DomElement.create( "span", "text" );
        selectedItemText.innerHTML = controlElement.select.options[ optionIndex ].text;
        selectedItem.appendChild( selectedItemText );

        if ( controlElement.multiSelectEnabled ) {
            const removeButton: HTMLElement = DomElement.create( "div", "remove" );
            removeButton.innerHTML = controlElement.bindingOptions.text!.removeText!;

            if ( controlElement.bindingOptions.showRemoveButtonOnLeft ) {
                selectedItem.insertBefore( removeButton, selectedItemText );
            } else {
                selectedItem.appendChild( removeButton );
            }

            removeButton.onclick = ( e: MouseEvent ) => {
                DomElement.cancelBubble( e );
    
                controlElement.select.options[ optionIndex ].selected = false;
    
                hideDropDownMenu( controlElement );
                renderSelectedItems( controlElement );
            };
        }
    }

    function buildDocumentEvents( controlElement: ControlElement ) : void {
        const hideMenu: any = () => hideDropDownMenu( controlElement );

        document.body.addEventListener( "click", hideMenu );
        window.addEventListener( "resize", hideMenu );
        window.addEventListener( "click", hideMenu );
    }

    function showDropDownMenu( controlElement: ControlElement ) : void {
        if ( !isDropDownMenuVisible( controlElement ) ) {
            setTimeout( function() {
                controlElement.dropDown.style.display = "block";

                renderDropDownItems( controlElement );
                renderSelectedItems( controlElement, false );

                Trigger.customEvent( controlElement.bindingOptions.events!.onDropDownShow! );

            }, controlElement.bindingOptions.dropDownShowDelay );

        } else {
            hideDropDownMenu( controlElement );
        }
    }

    function hideDropDownMenu( controlElement: ControlElement ) : void {
        if ( controlElement.dropDown !== null && controlElement.dropDown.style.display !== "none" ) {
            controlElement.dropDown.style.display = "none";

            renderSelectedItems( controlElement, false );

            Trigger.customEvent( controlElement.bindingOptions.events!.onDropDownHide! );
        }
    }

    function isDropDownMenuVisible( controlElement: ControlElement ) : boolean {
        return controlElement.dropDown !== null && controlElement.dropDown.style.display === "block";
    }

    function getValuesSelected( controlElement: ControlElement ) : string[] {
        const options: HTMLOptionsCollection = controlElement.select.options;
        const optionsLength: number = options.length;
        const optionValuesSelected: string[] = [];

        for ( let optionIndex: number = 0; optionIndex < optionsLength; optionIndex++ ) {
            const option: HTMLOptionElement = options[ optionIndex ];

            if ( option.selected ) {
                optionValuesSelected.push( option.value );
            }
        }

        return optionValuesSelected;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Document Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildGlobalDocumentEvents( addEvents: boolean = true ) : void {
        const documentFunc: Function = addEvents ? document.addEventListener : document.removeEventListener;

        documentFunc( "keydown", onWindowKeyDown );
    }

    function onWindowKeyDown( e: KeyboardEvent ) : void {
        if ( e.code === KeyCode.escape ) {
            e.preventDefault();
            hideDropDownMenus();
        }
    }

    function hideDropDownMenus() : void {
        const controlElementsLength: number = _control_Elements.length;

        for ( let controlElementIndex: number = 0; controlElementIndex < controlElementsLength; controlElementIndex++ ) {
            hideDropDownMenu( _control_Elements[ controlElementIndex ] );
        }
    }
    


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    const _public: PublicApi = {
        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( newConfiguration: any ) : PublicApi {
            if ( Is.definedObject( newConfiguration ) ) {
                let configurationHasChanged: boolean = false;
                const newInternalConfiguration: any = _configuration;
            
                for ( let propertyName in newConfiguration ) {
                    if ( newConfiguration.hasOwnProperty( propertyName ) && _configuration.hasOwnProperty( propertyName ) && newInternalConfiguration[ propertyName ] !== newConfiguration[ propertyName ] ) {
                        newInternalConfiguration[ propertyName ] = newConfiguration[ propertyName ];
                        configurationHasChanged = true;
                    }
                }
        
                if ( configurationHasChanged ) {
                    _configuration = Config.Options.get( newInternalConfiguration );
                }
            }
    
            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getVersion: function () : string {
            return "1.1.0";
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Select.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        _configuration = Config.Options.get();

        document.addEventListener( "DOMContentLoaded", function() {
            render();
            buildGlobalDocumentEvents();
        } );

        if ( !Is.defined( window.$select ) ) {
            window.$select = _public;
        }
    } )();
} )();