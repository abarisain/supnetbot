"use strict";

const AbstractCommandPlugin = require('./abstract_command_plugin');
const MessagesHandler = require('../../messages_handler');
const logger = require('winston');

const Twit = require('twit');

/**
 * Twitter command plugin
 * Gets the tweets for a specified nickname. Second argument controls pagination.
 */
class Twitter extends AbstractCommandPlugin {

    constructor(options) {
        super(options);

        this.tweetsPerPage = options.tweets_per_page;

        //TODO: Make this in config.js but ignore it for dev
        this.twit = new Twit({
            "consumer_key": process.env["TWITTER_KEY"],
            "consumer_secret": process.env["TWITTER_SECRET"],
            "app_only_auth": true
        });
    }

    get name() {
        return "twitter";
    }

    get alias() {
        return "t";
    }

    onCommand(args) {
        args = args || "";
        let argsArray = args.split(" ") || [];

        let username = argsArray[0];
        let page = parseInt(argsArray[1]);

        if (argsArray.length == 0 || "" === username || isNaN(page)) {
            MessagesHandler.sendMessage(null, "[Twitter] Usage: <nickname> [page (number)]");
            return;
        }

        logger.debug("Twitter: Getting statuses for " + username);
        this.twit.get("statuses/user_timeline", { "screen_name": username }, (err, data) => {
            if (err !== undefined) {
                MessagesHandler.sendMessage(null, "[Twitter] Error while getting tweets for " + username);
                logger.debug("[Twitter] Error while getting tweets for " + username + "\n" + err);
                return;
            }

            MessagesHandler.sendMessage(null, "[Twitter] Last Tweets from @" + username);
            for (let i = (page * this.tweetsPerPage); i < (this.tweetsPerPage + (page * this.tweetsPerPage)); i++) {
                if (data[i] === undefined) {
                    continue;
                }

                MessagesHandler.sendMessage(null, (i+1) + ": " + data[i].text.replace("\n", " "));
            }
        });
    }
}

module.exports = Twitter;