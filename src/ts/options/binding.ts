/**
 * Select.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!
 * 
 * @file        binding.js
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


import {
    type BindingOptionsCurrentView,
    type BindingOptions,
    type BindingOptionsEvents, 
    type BindingOptionsText } from "../type";

import { Default } from "../data/default";


export namespace Binding {
    export namespace Options {
        export function getForNewInstance( data: any, element: HTMLElement ) : BindingOptions {
            const bindingOptions: BindingOptions = Binding.Options.get( data );

            bindingOptions._currentView = {} as BindingOptionsCurrentView;
            bindingOptions._currentView.element = element;

            return bindingOptions;
        }

        export function get( newOptions: any ) : BindingOptions {
            let options: BindingOptions = Default.getObject( newOptions, {} as BindingOptions );
            options.render = Default.getBoolean( options.render, true );
            options.dropDownShowDelay = Default.getNumber( options.dropDownShowDelay, 50 );
            options.showDropDownButton = Default.getBoolean( options.showDropDownButton, true );
            options.showRemoveButtonOnLeft = Default.getBoolean( options.showRemoveButtonOnLeft, false );
            
            options = getText( options );
            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getText( options: BindingOptions ) : BindingOptions {
            options.text = Default.getObject( options.text, {} as BindingOptionsText );
            options.text!.removeText = Default.getString( options.text!.removeText, "X" );
            options.text!.noItemsSelectedText = Default.getString( options.text!.noItemsSelectedText, "There are no items selected" );

            return options;
        }
    
        function getCustomTriggers( options: BindingOptions ) : BindingOptions {
            options.events = Default.getObject( options.events, {} as BindingOptionsEvents );
            options.events!.onRenderComplete = Default.getFunction( options.events!.onRenderComplete, null! );
            options.events!.onSelectedItemsChanged = Default.getFunction( options.events!.onSelectedItemsChanged, null! );
            options.events!.onDropDownShow = Default.getFunction( options.events!.onDropDownShow, null! );
            options.events!.onDropDownHide = Default.getFunction( options.events!.onDropDownHide, null! );

            return options;
        }
    }
}