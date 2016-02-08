"use strict";

const AbstractBackend = require('./backends/abstract_backend');
const AbstractPlugin = require('./plugins/abstract_plugin');
const logger = require('winston');

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
         * Plugins registered to the handler.
         * Note: Only register a enabled plugin, since the handler won't check for that.
         *
         * @type {AbstractPlugin[]}
         */
        this.plugins = [];
    }

    /**
     * Register a backend on the message handler. It will start receiving messages from other backends and is expected to emit them.
     * Don't register a disabled backend!
     *
     * @param {AbstractBackend} backend
     */
    registerBackend(backend) {
        if (backend === undefined || backend === null) {
            throw new Error("MessagesHandler - registerBackend: 'backend' must be a instance of AbstractBackend");
        }

        this.backends.push(backend);
    }

    /**
     * Register a plugin on the message handler. It will start receiving messages emitted by backends.
     * Don't register a disabled plugin!
     *
     * @param {AbstractPlugin} plugin
     */
    registerPlugin(plugin) {
        if (plugin === undefined || plugin === null) {
            throw new Error("MessagesHandler - registerPlugin: 'plugin' must be a instance of AbstractPlugin");
        }

        this.plugins.push(plugin);
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

        logger.debug("[MessagesHandler] - [" + backend.name + "] <" + nickname + "> " + message);

        const backendName = backend.name;

        this.plugins.filter((plugin) => {
            if (plugin.isExcludedFromBackend(backendName)) {
                logger.debug("[MessagesHandler] - Plugin '" + plugin.name + "' is excluded for the backend '" + backendName + ". Not delivering.");
                return false;
            }
            return true;
        }).forEach((plugin) => {
            plugin.onMesssage(backend, nickname, message);
        });
    }

    /**
     * Send a message to specific backends.
     * @param {string|string[]} backends Names of the backends that should send this
     * @param {string} message Message to send
     */
    sendMessage(backends, message) {
        let _backends = null;
        if (typeof backends === "string") {
            _backends = [backends];
        } else if (backends instanceof Array) {
            _backends = backends;
        } else {
            _backends = [];
        }

        logger.debug("Sending to backend " + backends +": " + message);

        for (let backend of this.backends) {
            for (let allowedBackend of _backends) {
                if (allowedBackend === backend.name) {
                    backend.send(message);
                }
            }
        }
    }

    /**
     * Send a message to all backends, except for excluded ones.
     * @param {string|string[]?} excludedBackends Name of the backends that shouldn't send this
     * @param {string} message Message to send
     */
    sendMessageExcluding(excludedBackends, message) {
        let _excludedBackends = null;
        if (typeof excludedBackends === "string") {
            _excludedBackends = [excludedBackends];
        } else if (excludedBackends instanceof Array) {
            _excludedBackends = excludedBackends;
        } else {
            _excludedBackends = [];
        }

        logger.debug("Sending to all backends except " + excludedBackends +": " + message);

        for (let backend of this.backends) {
            for (let excludedBackend of _excludedBackends) {
                if (excludedBackend === backend.name) {
                    continue;
                }
                backend.send(message);
            }
        }
    }
}

module.exports = new MessagesHandler();