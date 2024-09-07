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


import { type BindingOptionsCurrentView, type BindingOptions } from "../type";
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

            options = getText( options );
            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getText( options: BindingOptions ) : BindingOptions {
            options.removeText = Default.getString( options.removeText, "X" );
            options.noItemsSelectedText = Default.getString( options.noItemsSelectedText, "There are no items selected" );

            return options;
        }
    
        function getCustomTriggers( options: BindingOptions ) : BindingOptions {
            options.onRenderComplete = Default.getFunction( options.onRenderComplete, null! );
            options.onSelectedItemsChanged = Default.getFunction( options.onSelectedItemsChanged, null! );
            options.onDropDownShow = Default.getFunction( options.onDropDownShow, null! );
            options.onDropDownHide = Default.getFunction( options.onDropDownHide, null! );

            return options;
        }
    }
}