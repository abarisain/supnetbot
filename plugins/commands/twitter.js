"use strict";

const AbstractCommandPlugin = require('./abstract_command_plugin');

class Twitter extends AbstractCommandPlugin {

    get name():string {
        return super.name;
    }

    get alias():string {
        return super.alias;
    }

    onCommand(args:string) {
        return super.onCommand(args);
    }
}