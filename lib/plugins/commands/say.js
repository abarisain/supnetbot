"use strict";

const AbstractCommandPlugin = require('./abstract_command_plugin');
const MessagesHandler = require('../../messages_handler');

/**
 * Say
 * Mostly says dumb stuff based on a list of known words
 */
class Say extends AbstractCommandPlugin {

    constructor(options) {
        super(options);

        /**
         * Known words. Will read the key and output the value.
         * @type {object}
         */
        this.words = options.words;

        if (typeof options.words !== "object") {
            throw new Error("[Say] - No words configured");
        }
    }

    get name() {
        return "say";
    }

    get alias() {
        return "s";
    }

    onCommand(backend, args) {
        let message = this.words[args.toLowerCase()];

        if (message === undefined || message === null) {
            MessagesHandler.sendMessage(backend.name, "I don't know what you mean by '" + args + "'.");
            return;
        }

        MessagesHandler.sendMessage(backend.name, message);
    }
}

module.exports = Say;