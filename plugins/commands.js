"use strict";

const logger = require('winston');
const AbstractPlugin  = require('./abstract_plugin');

/**
 * Base Command Plugin class
 */
class AbstractCommandPlugin {

  /**
   * Default constructor. This is the only one that the core wil@l load.
   * @param {object} options Raw object from config.js : config.plugins.commands.plugins.<name>
   */
  constructor(options) {
    /**
     * Users allowed to use this bot.
     * Format is "backend:nickname".
     * If equals to "*", everybody on every backend will be able to use it.
     *
     * There is no way to add a wildcard only for a backend as of now.
     *
     * @type {string[]}
     */
    this.allowedUsers = [];

    if (options.allowed_users instanceof Array) {
      for (let allowedUser of options.allowed_users) {
        if (typeof allowedUser !== "string") {
          continue;
        }
        this.allowedUsers.push(allowedUser);
      }
    }
  }

  // region Base methods, shouldn't be overriden

  /**
   * Is a user allowed to use this command plugin?
   * @param {string} backend Backend this message is coming from
   * @param {string} nickname User's nickname
   * @returns {boolean} Whether the user can use this or not
   */
  isUserAllowed(backend, nickname) {
    //TODO: Implement
  }

  // endregion

  // region Methods that you actually need to override

  /**
   * Command plugin name
   * @type {string}
   */
  get name() {
    throw new Error("AbstractCommandPlugin - 'get name' not implemented or called the base implementation");
  }

  /**
   * Command alias (for example 't' for 'twitter').
   * @type {string}
   */
  get alias() {
    throw new Error("AbstractCommandPlugin - 'get alias' not implemented or called the base implementation");
  }

  // endregion
}

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

    for(let plugin of Object.keys(plugins)) {
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
    //TODO : Implement
  }
}

module.exports = Commands;