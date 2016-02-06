"use strict";

/**
 * Abstract Plugin base
 * Note: There's not really a "abstract class" concept in JS, so just consider that you shouldn't instanciate this one
 */
class AbstractPlugin {

    /**
     * Default constructor. This is the only one that the core will load.
     * @param {object} options Raw object from config.js : config.plugins.<name>
     */
    constructor(options) {

        /**
         * Private counterpart to the excludedBackends property.
         * @type {string[]}
         * @private
         */
        this._excludedBackends = options.excluded_backends || [];

        if (options.excluded_backends instanceof Array) {
            this._excludedBackends = options.excluded_backends;
        } else {
            throw new TypeError("AbstractPlugin (" + this.name + ") - constructor: excluded_backends should be null or a string array");
        }


    }

    /**
     * Get the excluded backends.
     * @type {string[]}
     */
    get excludedBackends() {
        return this._excludedBackends.slice();
    }

    /**
     * Returns whether this plugin is excluded from the specified backend.
     * @param {string} backend Backend name
     * @returns {boolean} Whether this plugin is excluded from the specified backend.
     */
    isExcludedFromBackend(backend) {
        if (typeof backend !== "string") {
            throw new TypeError("AbstractPlugin - isExcludedFromBackend: backend should be a string");
        }

        for (var excludedBackend in this.excludedBackends) {
            if (backend === excludedBackend) {
                return true;
            }
        }

        return false;
    }

    //noinspection JSMethodCanBeStatic
    /**
     * The backend name.
     * @type {string}
     */
    get name() {
        throw new Error("AbstractPlugin - 'get name' not implemented or called the base implementation");
    }

    /**
     * Called when a backend got a message.
     * @param {AbstractBackend} backend Backend that got the message
     * @param {string} nickname Who sent it
     * @param {string} message The message itself
     */
    onMesssage(backend, nickname, message) {
        throw new Error("'onMesssage' not implemented or called the base implementation");
    }
}

module.exports = AbstractPlugin;