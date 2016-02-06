"use strict";

const MessagesHandler = require('../messages_handler');
const AbstractBackend = require('./abstract_backend');
const logger = require('winston');
const DiscordAPI = require('discord.js');

/**
 * Discord Backend
 * Note: Only supports accounts with one server for now.
 * Only listens to one channel too.
 */
class Discord extends AbstractBackend {

    constructor(options) {
        super(options);

        if (options.login === undefined) {
            throw new Error("[Discord] - Login wasn't configured");
        }

        if (options.password === undefined) {
            throw new Error("[Discord] - Password wasn't configured");
        }

        if (options.channel === undefined) {
            throw new Error("[Discord] - Channel wasn't configured");
        }
        /**
         * @type {string}
         */
        this.login = options.login;

        /**
         * @type {string}
         */
        this.password = options.password;

        /**
         * @type {string}
         */
        this.channel = options.channel;

        this.discordClient = new DiscordAPI.Client();

        this.discordClient.on("ready", () => {
           logger.info("[Discord] Connected");
        });

        this.discordClient.on("disconnected", () => {
            logger.info("[Discord] Disconnected");
            //TODO : Reconnect (or die?).
        });

        this.discordClient.on("message", (message) => {
            console.log(Object.keys(message));
            console.log(message.content);
        });
    }

    connect() {
        this.discordClient.login(this.login, this.password);
    }

    get name() {
        return "discord";
    }

    send(message) {
        // TOOO: Implement this
    }
}

module.exports = Discord;