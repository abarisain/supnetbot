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
            console.log("err: " + err);
            console.log("data: " + data);
            console.log("reponse: " + response);
        });
    }
}

module.exports = Twitter;