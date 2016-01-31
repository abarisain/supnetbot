"use strict";

const AbstractBackend = require('./backends/abstract_backend');
const AbstractPlugin = require('./plugins/abstract_plugin');

/**
 * Class responsible for bridging messages between backends and plugins.
 * It's the one who takes the final decision about who will print the message a plugin outputs.
 * Backends are expected to send their incoming messages to the handler, and only the handler,
 * just like plugins are expected to give their output to the handler rather than talking to the backends directly.
 *
 * Also implements some kind of "access control": Checks if a plugin excluded a backend, etc...
 *
 * Meant to be used with its singleton, obviously.
 */
class MessagesHandler {

  /**
   * Backends registered to the handler.
   * Note: Only register a enabled backend, since the handler won't check for that.
   *
   * @type {AbstractBackend[]}
   */
  const backends = [];

  /**
   * Backends registered to the handler.
   * Note: Only register a enabled backend, since the handler won't check for that.
   *
   * @type {AbstractPlugin[]}
   */
  const plugins = [];

  constructor() {

  }

  /**
   * Register a backend on the message handler. It will start receiving
   * Don't register a disabled backend!
   *
   * @param {AbstractBackend} backend
   */
  registerBackend(backend) {
    if (backend === undefined || backend === null) {
      throw new Error("MessagesHandler - registerBackend: 'backend' must be a instance of AbstractBackend");
    }
  }
}

module.exports = new MessagesHandler();