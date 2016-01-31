#!/usr/bin/env node

"use strict";

const config = require('./config');
const logger = require('winston');

const readline = require('readline');

logger.level = config.log_level;

logger.info("Starting supnetbot ´･ω･｀(what a shitty name)");

// Readline is here for easy debugging in the early development stages
if (config.modules.backends.stdin.enabled) {

}
