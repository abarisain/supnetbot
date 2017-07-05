#!/bin/bash
":" //# http://sambal.org/?p=1014; exec /usr/bin/env node --noharmony "$0" "$@"

require("../lib/server").start(require("./config"));
