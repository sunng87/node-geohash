#!/bin/sh

# build a client-side version
cat browser/intro.js ./main.js browser/outro.js >browser/geohash.js
