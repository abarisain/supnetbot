#!/usr/bin/env node

"use strict";

const logger = require('winston');

const config = require('./config');
const messagesHandler = require('./messages_handler');

logger.level = config.log_level;

logger.info("Starting supnetbot ´･ω･｀(what a shitty name)");

//TODO: Maybe get this out of server.js

const backends = {
  "terminal": require('./backends/terminal')
};

const enabledBackends = {};

for (var backendName of backends) {
  let backendConfig = config.backends[backendName];
  if (typeof backendConfig !== "object") {
    logger.error("Backend " + backendName + "isn't configured. Skipping.");
    continue;
  }
  if (backendConfig.enabled === true) {
    logger.info("Loading backend: " + backendName);
    let instance = new backends[backendName]();
    enabledBackends[backendName] = instance;
    messagesHandler.registerBackend(instance);
  }
}