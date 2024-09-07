/**
 * Select.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!
 * 
 * @file        config.js
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


import { type Configuration } from "../type";
import { Default } from "../data/default";


export namespace Config {
    export namespace Options {
        export function get( newConfiguration: any = null ) : Configuration {
            let configuration: Configuration = Default.getObject( newConfiguration, {} as Configuration );
            configuration.safeMode = Default.getBoolean( configuration.safeMode, true );
            configuration.domElementTypes = Default.getStringOrArray( configuration.domElementTypes, [ "select" ] );

            return configuration;
        }
    }
}