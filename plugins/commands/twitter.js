"use strict";

const AbstractCommandPlugin = require('./abstract_command_plugin');
const MessagesHandler = require('../../messages_handler');
const logger = require('winston');

const HTMLEntities = require('html-entities').AllHtmlEntities;
const Twit = require('twit');

/**
 * Twitter command plugin
 * Gets the tweets for a specified nickname. Second argument controls pagination.
 */
class Twitter extends AbstractCommandPlugin {

    constructor(options) {
        super(options);

        this.htmlEntities = new HTMLEntities();

        this.tweetsPerPage = options.tweets_per_page || 3;

        if (options.consumer_key === undefined) {
            throw new Error("[Twitter] - Consumer key wasn't configured");
        }

        if (options.consumer_secret === undefined) {
            throw new Error("[Twitter] - Consumer secret wasn't configured");
        }

        this.twit = new Twit({
            "consumer_key": options.consumer_key,
            "consumer_secret": options.consumer_secret,
            "app_only_auth": true
        });
    }

    get name() {
        return "twitter";
    }

    get alias() {
        return "t";
    }

    onCommand(backend, args) {
        args = args || "";
        let argsArray = args.split(" ") || [];

        let username = argsArray[0];
        let page = Math.max(parseInt(argsArray[1] || 0), 0);

        let getURL = argsArray[2] === "url";

        if (argsArray.length == 0 || "" === username || isNaN(page)) {
            MessagesHandler.sendMessageExcluding([], "[Twitter] Usage: <nickname> [page (number)]\n or: <nickname> <tweet number> url\n or: <tweet url>");
            return;
        }

        // The variable is called username, but it can be an URL.
        // Check if the string starts with "https://twitter.com" (with www. and http variants)
        let urlMatches = username.match(/^https?:\/\/(www\.)?twitter\.com\/.*\/status\/([0-9]*).*$/i);
        if (urlMatches != null && urlMatches.length == 3) {
            logger.debug("Twitter: Getting tweet for URL " + urlMatches[2]);
            this.twit.get("statuses/show/"+urlMatches[2], {}, (err, data) => {
                if (err !== undefined) {
                    MessagesHandler.sendMessageExcluding([], "[Twitter] Error while getting tweet for URL " + username);
                    logger.debug("[Twitter] Error while getting tweets for URL " + username + "\n" + err);
                    return;
                }
            });
        } else {
            logger.debug("Twitter: Getting statuses for " + username);
            this.twit.get("statuses/user_timeline", { "screen_name": username }, (err, data) => {
                if (err !== undefined) {
                    MessagesHandler.sendMessageExcluding([], "[Twitter] Error while getting tweets for " + username);
                    logger.debug("[Twitter] Error while getting tweets for " + username + "\n" + err);

                    MessagesHandler.sendMessageExcluding([], data["user"]["screen_name"] + " - " + data["text"]);

                    return;
                }

                if (getURL) {
                    let tweetIndex = page - 1;

                    if (data[tweetIndex] === undefined) {
                        MessagesHandler.sendMessageExcluding([], "[Twitter] Error while getting tweet " + page + " for " + username);
                        return;
                    }

                    // No need to resolve the real username, twitter will redirect if it's a RT
                    MessagesHandler.sendMessageExcluding([], "https://twitter.com/" + username + "/status/" + data[tweetIndex].id_str);
                } else {
                    let output = "[Twitter] Last Tweets from @" + username;

                    for (let i = (page * this.tweetsPerPage); i < (this.tweetsPerPage + (page * this.tweetsPerPage)); i++) {
                        if (data[i] === undefined) {
                            continue;
                        }

                        let htmlDecodedText = this.htmlEntities.decode(data[i].text || "");

                        output = output + "\n" + (i+1) + ": " + htmlDecodedText.replace(/\n/g, " ");
                    }

                    MessagesHandler.sendMessageExcluding([], output);
                }
            });   
        }
    }
}

module.exports = Twitter;