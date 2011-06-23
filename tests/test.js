var geohash = require('../main.js');
var assert = require('assert');

var longitude = 112.5584;
var latitude = 37.8324;

var hashstring = geohash.encode(37.8324, 112.5584, 9);
assert.equal(hashstring, 'ww8p1r4t8');

var latlon = geohash.decode('ww8p1r4t8');
assert.ok(Math.abs(37.8324-latlon.latitude) < 0.0001);
assert.ok(Math.abs(112.5584-latlon.longitude) < 0.0001 );

var north =  geohash.neighbor('dqcjq', [1,0]);
assert.equal(north, 'dqcjw');

var southwest = geohash.neighbor('DQCJQ', [-1,-1]);
assert.equal(southwest, 'dqcjj');

