/**
 * Select.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!
 * 
 * @file        dom.ts
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


import { Char } from "../data/enum";
import { Is } from "../data/is";


export namespace DomElement {
    export function create( type: string, className: string = Char.empty ) : HTMLElement {
        const nodeType: string = type.toLowerCase();
        const isText: boolean = nodeType === "text";

        let result: any = isText ? document.createTextNode( Char.empty ) : document.createElement( nodeType );

        if ( Is.defined( className ) ) {
            result.className = className;
        }

        return result;
    }

    export function cancelBubble( e: Event ) : void {
        e.preventDefault();
        e.stopPropagation();
    }
}