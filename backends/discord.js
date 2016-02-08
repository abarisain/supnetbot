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

        /**
         * Enqueued messages
         * @type {string[]}
         */
        this.messageQueue = [];

        /**
         * Is discord sending our messages? If true, enqueue, else, send directly
         * @type {boolean}
         */
        this.sending = false;

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
            if (this.channel === message.channel.id && this.discordClient.user.id !== message.author.id) {
                // Parse image messages
                if (message.attachments.length > 0) {
                    for (let attachment of message.attachments) {
                        MessagesHandler.messageReceived(this, message.author.username, message.author.username + " has uploaded a file (" + attachment.filename + "): " + attachment.url);
                    }
                } else {
                    MessagesHandler.messageReceived(this, message.author.username, message.content)
                }
            }
        });
    }

    connect() {
        this.discordClient.login(this.login, this.password);
    }

    get name() {
        return "discord";
    }

    send(message) {
        this.messageQueue.push(message);

        if (!this.sending) {
            // Start the queue processing if needed;
            this.processNextMessage();
        }
    }

    processNextMessage() {
        // Send the next message in the queue
        if (this.messageQueue.length > 0) {
            this.writeMessage(this.messageQueue.shift());
        } else {
            // The queue is empty, we're not sending
            this.sending = false;
        }
    }

    writeMessage(message) {
        this.sending = true;
        this.discordClient.sendMessage(this.channel, message, (err, message) => {
            if (err !== undefined && err !== null) {
                //TODO: See if message is undefined and retry if we can
                logger.error("[Discord] - Unable to send message. Error: " + err + " - Message: " + message);
            }

            this.processNextMessage();
        });
    }
}

module.exports = Discord;