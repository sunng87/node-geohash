var geohash = require('../main.js');
var assert = require('assert');

var longitude = 112.5584;
var latitude = 37.8324;

var hashstring = geohash.encode(37.8324, 112.5584);
assert.equal(hashstring, 'ww8p1r4t8');
var hashstring = geohash.encode(32, 117, 3);
assert.equal(hashstring, 'wte');

var hashstring_uint = geohash.encode_uint64(37.8324, 112.5584, 52);
assert.equal(hashstring_uint, 4064984913515641);

var latlon = geohash.decode('ww8p1r4t8');
assert.ok(Math.abs(37.8324-latlon.latitude) < 0.0001);
assert.ok(Math.abs(112.5584-latlon.longitude) < 0.0001 );

var latlon_uint = geohash.decode_uint64(4064984913515641);
assert.ok(Math.abs(37.8324-latlon_uint.latitude) < 0.0001);
assert.ok(Math.abs(112.5584-latlon_uint.longitude) < 0.0001 );

var north =  geohash.neighbor('dqcjq', [1,0]);
assert.equal(north, 'dqcjw');

var southwest = geohash.neighbor('DQCJQ', [-1,-1]);
assert.equal(southwest, 'dqcjj');

var bboxes = geohash.bboxes(30, 120, 30.0001, 120.0001, 8);
assert.equal(bboxes[bboxes.length-1], geohash.encode(30.0001, 120.0001, 8));
