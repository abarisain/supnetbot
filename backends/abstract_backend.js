"use strict";

/**
 * Abstract Backend base
 * Note: There's not really a "abstract class" concept in JS, so just consider that you shouldn't instanciate this one
 */
class AbstractBackend {

  //region Abstract methods, to be overriden

  /**
  * Default constructor. This is the only one that the core will load.
  * @param {object} options Raw object from config.js : config.modules.backends.<name>
  */
  constructor(options) {
  }

  //noinspection JSMethodCanBeStatic
  /**
  * Connects the Backend.
  */
  connect() {
    throw new Error("'connect' not implemented or called the base implementation");
  }

  //noinspection JSMethodCanBeStatic
  /**
  * The backend name.
  * @type {string}
  */
  get name() {
    throw new Error("'get name' not implemented or called the base implementation");
  }

  //endregion

  //region Base methods, made for the implementation to call

  /**
   * Call this method when you get a message, so that other backends and plugins can be notified.
   * @param {string} user
   * @param {string} message
   */
  emitMessageReceived(user, message) {

  }

  //endregion
}

module.exports = AbstractBackend;
