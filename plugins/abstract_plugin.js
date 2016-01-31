"use strict";

/**
 * Abstract Plugin base
 * Note: There's not really a "abstract class" concept in JS, so just consider that you shouldn't instanciate this one
 */
class AbstractPlugin {

  /**
   * Default constructor. This is the only one that the core will load.
   * @param {object} options Raw object from config.js : config.plugins.<name>
   */
  constructor(options) {

  }
}

module.exports = AbstractPlugin;