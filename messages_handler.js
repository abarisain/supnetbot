"use strict";

const AbstractBackend = require('./backends/abstract_backend');
const AbstractPlugin = require('./plugins/abstract_plugin');

/**
 * Class responsible for bridging messages between backends and plugins.
 * It's the one who takes the final decision about who will print the message a plugin outputs.
 * Backends are expected to send their incoming messages to the handler, and only the handler,
 * just like plugins are expected to give their output to the handler rather than talking to the backends directly.
 *
 * Also implements some kind of "access control": Checks if a plugin excluded a backend, etc...
 *
 * Meant to be used with its singleton, obviously.
 */
class MessagesHandler {

    constructor() {
        /**
         * Backends registered to the handler.
         * Note: Only register a enabled backend, since the handler won't check for that.
         *
         * @type {AbstractBackend[]}
         */
        this.backends = [];

        /**
         * Backends registered to the handler.
         * Note: Only register a enabled backend, since the handler won't check for that.
         *
         * @type {AbstractPlugin[]}
         */
        this.plugins = [];
    }

    /**
     * Register a backend on the message handler. It will start receiving
     * Don't register a disabled backend!
     *
     * @param {AbstractBackend} backend
     */
    registerBackend(backend) {
        if (backend === undefined || backend === null) {
            throw new Error("MessagesHandler - registerBackend: 'backend' must be a instance of AbstractBackend");
        }
    }

    /**
     * Method to be called when a backend gets a message and wants to forward it to the other modules.
     * It should split the nickname and message and send them as different arguments.
     * @param {AbstractBackend} backend Backend that got the message
     * @param {string} nickname Who sent it
     * @param {string} message The message itself
     */
    messageReceived(backend, nickname, message) {
        if (backend === undefined || backend === null) {
            throw new TypeError("MessagesHandler - messageReceived: backend must be a AbstractBackend instance");
        }
        if (nickname === undefined || nickname === null) {
            throw new TypeError("MessagesHandler - messageReceived: nickname must be a string");
        }
        if (message === undefined || message === null) {
            throw new TypeError("MessagesHandler - messageReceived: message must be a string");
        }

        const backendName = backend.name;

        this.plugins.filter((plugin) => {
            return !plugin.isExcludedFromBackend(backendName);
        }).forEach((plugin) => {
            plugin.onMesssage(backend, nickname, message);
        });
    }

    /**
     * Send a message to all backends, except for excluded ones.
     * @param {string[]?} excludedBackends Name of the backends that shouldn't send this
     * @param {string} message Message to send
     */
    sendMessage(excludedBackends, message) {
        let _excludedBackends = excludedBackends || [];

        for (let backend of this.backends) {
            if (_excludedBackends.indexOf(backend.name) == -1) {
                backend.send(message);
            }
        }
    }
}

module.exports = new MessagesHandler();