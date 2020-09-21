#!/bin/bash

$(sleep 0.25 && firefox "http://localhost:7829") &
node server.js
