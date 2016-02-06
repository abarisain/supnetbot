"use strict";

const MessagesHandler = require('../messages_handler');
const AbstractBackend = require('./abstract_backend');
const logger = require('winston');
const IRCClient = require('irc');

/**
 * IRC Backend
 */
class IRC extends AbstractBackend {

    constructor(options) {
        super(options);

        if (options.server === undefined) {
            throw new Error("[IRC] - Server wasn't configured");
        }

        if (options.channel === undefined) {
            throw new Error("[IRC] - Channel wasn't configured");
        }

        if (options.nickname === undefined) {
            throw new Error("[IRC] - Nickname wasn't configured");
        }

        this.ircClient = null;

        /**
         * @type {string}
         */
        this.server = options.server;

        /**
         * @type {string}
         */
        this.channel = options.channel;

        /**
         * @type {string}
         */
        this.nickname = options.nickname;
    }

    connect() {
        this.ircClient = new IRCClient.Client(this.server, this.nickname, {
            "channels": [this.channel]
        });

        this.ircClient.addListener("error", (message) => {
           logger.error("[IRC] Error: " + message);
        });

        this.ircClient.addListener('message', function (from, to, message) {
            console.log(from + ' => ' + to + ': ' + message);
        });
    }

    get name() {
        return "irc";
    }

    send(message) {
        this.ircClient.say(this.channel, message);
    }
}

module.exports = IRC;