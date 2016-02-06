"use strict";

const AbstractCommandPlugin = require('./abstract_command_plugin');
const MessagesHandler = require('../../messages_handler');
const logger = require('winston');

const Twit = require('twit');

class Twitter extends AbstractCommandPlugin {

    constructor(options) {
        super(options);

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
        logger.debug("Twitter: Getting statuses for " + args);
        this.twit.get("statuses/user_timeline", { "screen_name": args }, function(err, data, response) {
            if (err !== undefined) {
                MessagesHandler.sendMessage(null, "[Twitter] Error while getting tweets for " + args);
                logger.debug("[Twitter] Error while getting tweets for " + args + "\n" + err);
                return;
            }

            MessagesHandler.sendMessage(null, "[Twitter] Last Tweets from @" + args);
            for (let i = 0; i < 3; i++) {
                if (data[i] === undefined) {
                    continue;
                }

                MessagesHandler.sendMessage(null, (i+1) + ": " + data[i].text.replace("\n", " "));
            }
        });
    }
}

module.exports = Twitter;