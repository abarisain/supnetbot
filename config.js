"use strict";

module.exports = {
    "log_level": "debug",
    "backends": {
        "terminal": { // Debug terminal module
            "enabled": true,
            "nickname": "arnaud" // terminal isn't multiuser, so we need to simulate one
        },
        "irc": {
            "enabled": true,
            "server": process.env["IRC_SERVER"],
            "password": null,
            "channel": process.env["IRC_CHANNEL"], //use "channel password" if you need one
            "nickname": process.env["IRC_NICKNAME"],
            "debug": false
        },
        "discord": {
            "enabled": true,
            "login": process.env["DISCORD_LOGIN"],
            "password": process.env["DISCORD_PASSWORD"],
            // All channels are joined on Discord, but pick which one to listen to.
            // Channels are unique between servers.
            // You can find the channel name in the url when in a browser:
            // https://discordapp.com/channels/<serverid>/<channel>
            // The second id is the one you need to set here. Only numbers
            "channel": process.env["DISCORD_CHANNEL"]
        }
    },
    "plugins": {
        "logger": {
            "enabled": true,
            "excluded_backends": ["terminal"],
            "output_dir": process.env["LOGGER_DIR"]
        },
        "commands": {
            "enabled": true,
            "excluded_backends": [], // Exclude a backend for this plugin. Ex: ["irc"]
            "prefix": "!",
            "plugins": {
                "twitter": {
                    "enabled": true,
                    "allowed_users": ["*"],
                    "tweets_per_page": 3,
                    "consumer_key": process.env["TWITTER_KEY"],
                    "consumer_secret": process.env["TWITTER_SECRET"]
                },
                "admin": {
                    "enabled": true,
                    "allowed_users": ["irc:Dream_Team", "discord:Aranom"]
                },
                "say": {
                    "enabled": true,
                    "allowed_users": ["*"],
                    "words": {
                        "tableflip": "(╯°□°）╯︵ ┻━┻",
                        "rick": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "woop": "PUTAIN J'EN AI RAS LE CUL DES ARBITRES DANS FIFA",
                        "octal": "mange moi",
                        "sim": "tg",
                        "Julie": "y'a plus de coca"
                    }
                }
            }
        },
        "bridge": { // Bridge messages from other protocols (stdin, Discord, IRC) between eachother
            "enabled": true,
            "excluded_backends": null
        }
    }
};
