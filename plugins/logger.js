"use strict";

const fs = require('fs');
const path = require('path');

const logger = require('winston');
const moment = require('moment');

const AbstractPlugin = require('./abstract_plugin');
const MessagesHandler = require('../messages_handler');

/**
 * Plugin that logs messages from backends to the configured directory.
 * Logs in the same format as eggdrops : [HH:mm] <nickname> message
 */
class Logger extends AbstractPlugin {

    constructor(options) {
        super(options);

        /**
         * Log files file descriptors. Lazily loaded. Key = backend name, value = fd
         * @type {object}
         */
        this.fileDescriptors = {}

        this.outputDir = options.output_dir || "";

        if (typeof this.outputDir !== "string") {
            throw new Error("[Logger] - Outputdir must be a string");
        }

        try {
            if (!fs.statSync(this.outputDir).isDirectory()) {
                //noinspection ExceptionCaughtLocallyJS
                throw new Error();
            }
        } catch (e) {
            throw new Error("[Logger] - Ouputdir must exist and be a directory");
        }
    }

    get name() {
        return "logger";
    }

    onMesssage(backend, nickname, message) {
        let fileDescriptor = this.fileDescriptors[backend.name];

        if (fileDescriptor === undefined) {
            // Make it syncrhonous to simplify the code here, it will stay opened anyway
            // Append to file, create it if it doesn't exist, and set its permissions to 0760
            let filePath = path.join(this.outputDir, backend.name + ".log");
            try {
                fileDescriptor = fs.openSync(filePath, 'a', 0o0760);
                this.fileDescriptors[backend.name] = fileDescriptor
            } catch (e) {
                logger.error("[Logger] - Error while opening '" + filePath + "' for writing: " + e);
            }
        }

        if (fileDescriptor === undefined) {
            // If it is still undefined here, we had a problem opening the file. Skip it.
            return;
        }

        try {
            // TODO: Check if this isn't a performance disaster
            // TODO: irssi format
            fs.appendFileSync(fileDescriptor, "[" + moment().format("H:mm") + "] <" + nickname.replace(/ /g, "") + "> " + message + "\n");
        } catch (e) {
            logger.error("[Logger] - Error while appending to log for backend '" + backend.name + '": ' + e);
        }
    }
}

module.exports = Logger;
