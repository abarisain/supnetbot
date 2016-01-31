"use strict";

module.exports = {
  "log_level": "debug",
  "modules": {
    "backends": {
      "terminal": { // Debug terminal module
        "enabled": true,
        "nickname": "arnaud" // terminal isn't multiuser, so we need to simulate one
      },
      "irc": {
        "enabled": false,
        "server": "localhost:6667",
        "password": null,
        "channels": ["#supbottest"], //use channel:password if you need one
        "nickname": "JeanYves"
      },
      "discord": {
        "enabled": false,
        "login": "",
        "password": "",
        "invite": "",
        "channels": ["#general"] // All channels are joined on Discord, but pick which ones to listen to
      }
    },
    "logger": {
      "enabled": false,
      "excluded_backends": null
    },
    "commands": {
      "enabled": false,
      "excluded_backends": "irc", // Exclude a backend for this plugin
      "prefix": "!",
      "commands": {
        "twitter": {
          "enabled": true,
          "allowed_users": ["*"]
        },
        "admin": {
          "enabled": true,
          "allowed_users": ["irc:Dream_Team", "discord:Aranom"]
        }
      }
    },
    "bridge": { // Bridge messages from other protocols (stdin, Discord, IRC) between eachother
      "enabled": false,
      "excluded_backends": null
    }
  }
};
