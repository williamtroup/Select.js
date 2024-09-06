/**
 * Select.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for creating multi-select drop-down lists!
 * 
 * @file        api.ts
 * @version     v1.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


export type PublicApi = {
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Configuration
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
	setConfiguration: ( configuration: any ) => PublicApi;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Additional Data
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
	getVersion: () => string;
};

declare global {
	interface Window {
		$select: PublicApi;
	}
}