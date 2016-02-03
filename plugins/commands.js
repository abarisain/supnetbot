"use strict";

const AbstractPlugin  = require('./abstract_plugin');

class Twitter extends AbstractPlugin {

  constructor(options) {
    super(options);

    if (options.nickname === undefined) {
      throw new Error("Command - Nickname wasn't configured");
    }

    this.prefix
  }

  get name() {
    return "twitter";
  }

  onMesssage(backend, nickname, message) {

  }
}
