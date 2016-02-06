"use strict";

const logger = require('winston');
const AbstractPlugin = require('./abstract_plugin');

const plugins = {
    //"twitter": require('')
};

class Commands extends AbstractPlugin {

    constructor(options) {
        super(options);

        if (typeof options.prefix !== "string") {
            throw new Error("Commands - Prefix wasn't configured");
        }

        if (typeof options.plugins !== "object") {
            throw new Error("Commands - Plugins were not configured");
        }

        /**
         * Prefix required to trigger the bot.
         * @type {string}
         */
        this.prefix = options.prefix;

        /**
         * Loaded plugins.
         * Disabled plugins are not loaded.
         * @type {AbstractCommandPlugin[]}
         */
        this.loadedPlugins = [];

        for (let plugin of Object.keys(plugins)) {
            let pluginOptions = options.commands.plugins[plugin];
            if (typeof pluginOptions !== "object") {
                logger.error("Commands - Plugin " + plugin.name + "'s options are missing. Skipping.");
                continue;
            }

            if (pluginOptions.enabled === true) {
                logger.info("Commands - Loading plugin: " + plugin.name);
                this.loadedPlugins.push(new plugins[plugin](pluginOptions));
            }
        }
    }

    get name() {
        return "commands";
    }

    onMesssage(backend, nickname, message) {
        if (!message.startsWith(this.prefix)) {
            return;
        }

        for (let plugin of this.loadedPlugins) {
            // command prefix + command plugin alias
            let pluginPrefix = this.prefix + plugin.alias;
            if (message.startsWith(pluginPrefix) && plugin.isUserAllowed(backend.name, nickname)) {
                plugin.onCommand(message.substring(pluginPrefix.length + 1));
            }
        }
    }
}

module.exports = Commands;