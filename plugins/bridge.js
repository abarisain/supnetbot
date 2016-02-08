"use strict";

const logger = require('winston');
const AbstractPlugin = require('./abstract_plugin');
const MessagesHandler = require('../messages_handler');
/**
 * Plugin that bridges messages between backends
 */
class Bridge extends AbstractPlugin {

    constructor(options) {
        super(options);
    }

    get name() {
        return "commands";
    }

    onMesssage(backend, nickname, message) {
        // Do NOT forget to EXCLUDE the origin backend so that you end up echoing yourself
        MessagesHandler.sendMessageExcluding(backend.name, "<" + nickname + "> " + message);
    }
}

module.exports = Bridge;