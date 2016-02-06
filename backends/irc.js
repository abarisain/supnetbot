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

        this.ircClient = new IRCClient.Client(this.server, this.nickname, {
            "autoConnect": false,
            "userName": this.nickname,
            "realName": this.nickname + " a friendly hackable bot",
            "debug": options.debug || false,
            "channels": [this.channel]
        });

        this.ircClient.addListener("error", (message) => {
            logger.error("[IRC] Error: " + message);
        });

        this.ircClient.addListener("message", (from, to, message) => {
            // Ignore messages not from channels we want, so we avoid PRIVMSG spam
            // Split on " ", which is the password separator for the IRC lib ("#channel password".split(" ")[0] = "#channel")

            // Maybe it will reply to PMs in a future version, but that's complicated with the architecture
            // I picked
            if (this.channel.split(" ")[0].toLowerCase() === to.toLowerCase()) {
                MessagesHandler.messageReceived(this, from, message);
            }

        });
    }

    connect() {
        this.ircClient.connect(5);
    }

    get name() {
        return "irc";
    }

    send(message) {
        this.ircClient.say(this.channel, message);
    }
}

module.exports = IRC;