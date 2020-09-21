#!/bin/bash

emsdk activate sdk-fastcomp-1.38.21-64bit
source "/usr/lib/emsdk/emsdk_env.sh"
$(sleep 0.25 && firefox "http://localhost:7829") &
node server.js
