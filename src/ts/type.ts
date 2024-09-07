/**
 * Select.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!
 * 
 * @file        type.js
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


export type StringToJson = {
    parsed: boolean;
    object: any;
};

export type ControlElement = {
    control: HTMLElement;
    dropDown: HTMLElement;
    select: HTMLSelectElement;
    bindingOptions: BindingOptions;
    multiSelectEnabled: boolean;
};

export type Configuration = {
	safeMode?: boolean;
	domElementTypes?: string[] | string;
};

export type BindingOptions = {
    _currentView: BindingOptionsCurrentView;
    render?: boolean;
    dropDownShowDelay?: number;
    showDropDownButton?: boolean;
    removeText?: string;
    noItemsSelectedText?: string;
    onRenderComplete?: ( element: HTMLElement ) => void;
    onSelectedItemsChanged?: ( selectValues: any[] ) => void;
    onDropDownShow?: ( element: HTMLElement ) => void;
    onDropDownHide?: ( element: HTMLElement ) => void;
};

export type BindingOptionsCurrentView = {
    element: HTMLElement;
};