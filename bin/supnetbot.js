#!/bin/bash
":" //# http://sambal.org/?p=1014; exec /usr/bin/env node --harmony "$0" "$@"

require("../lib/server").start(require("./config"));
