/**
 * Select.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!
 * 
 * @file        type.js
 * @version     v1.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


export type StringToJson = {
    parsed: boolean;
    object: any;
};

export type Configuration = {
	safeMode?: boolean;
	domElementTypes?: string[] | string;
};

export type BindingOptions = {
    _currentView: BindingOptionsCurrentView;
};

export type BindingOptionsCurrentView = {
    element: HTMLElement;
};