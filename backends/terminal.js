const MessagesHandler = require('../messages_handler');
const AbstractBackend = require('./abstract_backend');
const readline = require('readline');

/**
 * Terminal backend (powered by readline).
 * For debug purposes only: binds to stdin and stdout, so it will mix up with languages.
 */
class Terminal extends AbstractBackend {

  constructor(options) {
    super(options);

    if (options.nickname === undefined) {
      throw new Error("Terminal - Nickname wasn't configured");
    }

    this.readlineInterface = null;

    /**
     * @type {string}
     */
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

  send(message) {
    console.log(message);
  }

//endregion

  bindEvents() {
    this.readlineInterface.on("line", (line) => {
      //noinspection JSCheckFunctionSignatures
      MessagesHandler.messageReceived(this, this.nickname, line);
    });
  }
}

module.exports = Terminal;
