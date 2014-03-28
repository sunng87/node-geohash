var geohash = require('../main.js');
var assert = require('assert');

var longitude = 112.5584;
var latitude = 37.8324;

var hashstring = geohash.encode(37.8324, 112.5584);
assert.equal(hashstring, 'ww8p1r4t8');
var hashstring = geohash.encode(32, 117, 3);
assert.equal(hashstring, 'wte');

//Simple Auto Test
hashstring = geohash.encode(44.97, -93.26, geohash.ENCODE_AUTO);
assert.equal(hashstring, '9zvxvfd1h');

hashstring = geohash.encode('44.97', '-93.26', geohash.ENCODE_AUTO);
assert.equal(hashstring, '9zvxvfd');

hashstring = geohash.encode('44.978120', '-93.263536', geohash.ENCODE_AUTO);
assert.equal(hashstring, '9zvxvsp8d170t');

//Multi Auto Test
for (var i = 0; i < 25; i++) {
	var lat = (Math.random() * 180 - 90).toString();
	var lon = (Math.random() * 360 - 180).toString();
	var length = Math.floor(Math.random() * 5);
	lat = lat.substr(0, 5 + length);
	lon = lon.substr(0, 5 + length);
	
	hashstring = geohash.encode(lat, lon, geohash.ENCODE_AUTO);
	latlon = geohash.decode(hashstring);
	console.log(latlon);
	var decodedLat = latlon.latitude.toString();
	var decodedLon = latlon.longitude.toString();
	
	var latLength = lat.split('.')[1].length;
	var lonLength = lon.split('.')[1].length;
	
	var roundedDecodedLat = Math.round(decodedLat * Math.pow(10, latLength))/Math.pow(10, latLength);
	var roundedDecodedLon = Math.round(decodedLon * Math.pow(10, lonLength))/Math.pow(10, lonLength);
	for (var j in lat) {
		assert.equal(
				lat,
				roundedDecodedLat,
				lat+" didn't equal "+roundedDecodedLat+" (latLength: "+latLength+")");
		assert.equal(
				lon,
				roundedDecodedLon,
				lon+" didn't equal "+roundedDecodedLon+" (lonLength: "+lonLength+")");
	}
}


var hashstring_uint = geohash.encode_uint64(37.8324, 112.5584, 52);
assert.equal(hashstring_uint, 4064984913515641);

var latlon = geohash.decode('ww8p1r4t8');
assert.ok(Math.abs(37.8324 - latlon.latitude) < 0.0001);
assert.ok(Math.abs(112.5584 - latlon.longitude) < 0.0001);

var latlon_uint = geohash.decode_uint64(4064984913515641);
assert.ok(Math.abs(37.8324-latlon_uint.latitude) < 0.0001);
assert.ok(Math.abs(112.5584-latlon_uint.longitude) < 0.0001 );

var north =  geohash.neighbor('dqcjq', [1,0]);
var north = geohash.neighbor('dqcjq', [1, 0]);
assert.equal(north, 'dqcjw');

var southwest = geohash.neighbor('DQCJQ', [-1, -1]);
assert.equal(southwest, 'dqcjj');

var bboxes = geohash.bboxes(30, 120, 30.0001, 120.0001, 8);
assert.equal(bboxes[bboxes.length-1], geohash.encode(30.0001, 120.0001, 8));
assert.equal(bboxes[bboxes.length - 1], geohash.encode(30.0001, 120.0001, 8));
