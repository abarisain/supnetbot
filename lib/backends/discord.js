"use strict";

const MessagesHandler = require("../messages_handler");
const AbstractBackend = require("./abstract_backend");
const logger = require("winston");
const DiscordAPI = require("discord.js");

/**
 * Regexp for parsing channel deeplinks in messages.
 * Yes, discord kills everything that looks like that, even if it's in the middle of a word. >_>
 * @type {RegExp}
 */
const DISCORD_CHANNEL_REGEXP = /<#[0-9]+>/g;

/**
 * Mention regexp
 * Finds words starting by @ to convert them to Discord mentions
 * 
 * Thanks Psy
 * 
 * @type {RegExp}
 */
let MENTION_REGEXP = null;
try {
  MENTION_REGEXP = /(?<=^|(?<=[^a-zA-Z0-9-\.]))@([A-Za-z0-9_]+)/gi;
} catch (err) {
  console.error(
    "Could not create MENTION_REGEXP. Discord mention conversion will be disabled. You can enable this by providing '--harmony' to your NodeJS arguments. Original error: ",
    err
  );
}

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

    if (options.token === undefined) {
      throw new Error("[Discord] - Token wasn't configured");
    }

    if (options.channel === undefined) {
      throw new Error("[Discord] - Channel wasn't configured");
    }

    /**
     * @type {string}
     */
    this.token = options.token;

    /**
     * @type {string}
     */
    this.channelID = options.channel;

    /**
     * @type {DiscordAPI.TextChannel}
     */
    this.channel = null;

    this.discordClient = new DiscordAPI.Client();

    this.discordClient.on("ready", () => {
      logger.info("[Discord] Connected");
    });

    this.discordClient.on("disconnected", () => {
      logger.info("[Discord] Disconnected");
      this.connect();
    });

    this.discordClient.on("message", message => {
      if (
        this.channelID === message.channel.id &&
        this.discordClient.user.id !== message.author.id
      ) {
        let username;
        if (message.member && message.member.nickname) {
          username = message.member.nickname;
        } else {
          username = message.author.username;
        }
        // Parse image messages
        if (message.attachments.size > 0) {
          message.attachments.forEach(attachment => {
            MessagesHandler.messageReceived(
              this,
              username,
              username +
                " has uploaded a file (" +
                attachment.filename +
                "): " +
                attachment.url
            );
          });
        } else {
          let cleanMessage = message.cleanContent;
          // Try to resolve channels, not yet hanlded by the lib
          let linkedChannels = cleanMessage.match(DISCORD_CHANNEL_REGEXP);
          if (linkedChannels != null && linkedChannels.length > 0) {
            let channels = this.discordClient.channels;

            // Very little chance that it is empty, but we must make sure
            if (channels instanceof Array && channels.length > 0) {
              for (let rawChannel of cleanMessage.match(
                DISCORD_CHANNEL_REGEXP
              )) {
                for (let channel of channels) {
                  if (
                    rawChannel.substring(2, rawChannel.length - 1) == channel.id
                  ) {
                    cleanMessage = cleanMessage.replace(
                      rawChannel,
                      "#" + channel.name
                    );
                  }
                }
              }
            }
          }

          MessagesHandler.messageReceived(this, username, cleanMessage);
        }
      }
    });
  }

  connect() {
    this.discordClient.login(this.token);
  }

  get name() {
    return "discord";
  }

  send(message) {
    if (MENTION_REGEXP) {
      message = this.convertMentions(message);
    }

    this.messageQueue.push(message);

    if (!this.sending) {
      // Start the queue processing if needed;
      this.processNextMessage();
    }
  }

  getChannel() {
    if (!this.channel) {
      this.channel = this.discordClient.channels.get(this.channelID);
    }
    return this.channel;
  }

  convertMentions(message) {
    let channel = this.getChannel();
    if (!channel) {
      // Getting the channel failed: put the message in the retry queue, and stop sending
      // until we get another message, at which point we will try again
      logger.error(
        "[Discord] Failed to find the configured channel: cannot convert mentions"
      );
      return message;
    }

    return message.replace(MENTION_REGEXP, mention => {
      let username = mention.substring(1).toLowerCase();
      let member = this.channel.members.find(
        x =>
          username.localeCompare(
            (x.nickname || x.user.username).toLowerCase()
          ) === 0
      );
      if (member && member.id) {
        return "<@" + member.id + ">";
      }
      return mention;
    });
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
    let channel = this.getChannel();
    if (!channel) {
      // Getting the channel failed: put the message in the retry queue, and stop sending
      // until we get another message, at which point we will try again
      logger.error(
        "[Discord] Failed to find the configured channel: messages will not be sent"
      );
      this.messageQueue.push(message);
      this.sending = false;
      return;
    }

    channel
      .send(message)
      .catch(err => {
        logger.error(
          "[Discord] - Unable to send message. Error: " +
            err +
            " - Message: " +
            message
        );
      })
      .then(message => {
        // Do this irregardless of the error state
        this.processNextMessage();
      });
  }
}

module.exports = Discord;
