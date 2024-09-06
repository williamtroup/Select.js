/**
 * Select.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!
 * 
 * @file        select.ts
 * @version     v1.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


import { PublicApi } from "./ts/api";
import { Is } from "./ts/data/is";
import { Config } from "./ts/options/config";
import { type Configuration } from "./ts/type";


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;
    


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
            return "3.0.1";
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Select.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        _configuration = Config.Options.get();

        if ( !Is.defined( window.$select ) ) {
            window.$select = _public;
        }
    } )();
} )();