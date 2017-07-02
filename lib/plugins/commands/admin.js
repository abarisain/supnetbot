"use strict";

const AbstractCommandPlugin = require("./abstract_command_plugin");
const MessagesHandler = require("../../messages_handler");

/**
 * Admin
 * Admin only commands
 */
class Admin extends AbstractCommandPlugin {
  constructor(options) {
    super(options);
  }

  get name() {
    return "admin";
  }

  get alias() {
    return "a";
  }

  onCommand(backend, args) {
    const command = args.toLowerCase();

    if (command === "die") {
      process.exit(1);
    }
  }
}

module.exports = Admin;
