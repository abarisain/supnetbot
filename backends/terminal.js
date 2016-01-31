"use strict";

const AbstractBackend = require('./abstract_backend');
var readline = require('readline');
/**
 * Terminal backend (powered by readline).
 * For debug purposes only: binds to stdin and stdout, so it will mix up with languages.
 */
class Terminal extends AbstractBackend {

  var nickname;
  var readlineInterface;

  constructor(options) {
    super(options);
    this.nickname = options.nickname;
  }

  //region Base methods

  connect() {
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    this.bindEvents();
  }

  get name() {
    return "terminal";
  }

  //endregion

  bindEvents() {
    this.readlineInterface.on("line", function (line) {
      this.emitMessageReceived(this.nickname, line);
    });
  }
}

module.exports = Terminal;