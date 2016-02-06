"use strict";

const AbstractCommandPlugin = require('./abstract_command_plugin');
const MessagesHandler = require('../../messages_handler');

class Twitter extends AbstractCommandPlugin {

    get name() {
        return "twitter";
    }

    get alias() {
        return "t";
    }

    onCommand(args) {
        MessagesHandler.sendMessage(null, "it works " + args);
    }
}

module.exports = Twitter;