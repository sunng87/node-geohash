var geohash = require('../main.js');
var test = require('assert');

var longitude = 112.5584;
var latitude = 37.8324;

exports.testEncodeBasic = function (test) {
  var hashString = geohash.encode(37.8324, 112.5584);
  test.equal(hashString, 'ww8p1r4t8');

  hashString = geohash.encode(32, 117, 3);
  test.equal(hashString, 'wte');
  test.done();
}

exports.testUIntEncodeBasic = function (test) {
  var hashStringUInt = geohash.encode_uint64(37.8324, 112.5584, 52);
  test.equal(hashStringUInt, 4064984913515641);
  test.done();
}

exports.testDecodeBasic = function (test) {
  var latLon = geohash.decode('ww8p1r4t8');
  test.ok(Math.abs(37.8324 - latLon.latitude) < 0.0001);
  test.ok(Math.abs(112.5584 - latLon.longitude) < 0.0001);
  test.done();
}

exports.testDecodeUIntBasic = function (test) {
  var latLonUInt = geohash.decode_uint64(4064984913515641);
  test.ok(Math.abs(37.8324 - latLonUInt.latitude) < 0.0001, "(37.8324 - "+latLonUInt.latitude+" was >= 0.0001");
  test.ok(Math.abs(112.5584 - latLonUInt.longitude) < 0.0001, "(112.5584 - "+latLonUInt.longitude+" was >= 0.0001");
  test.done();
}

exports.teshEncodeAutoBasic = function (test) {
  //Simple Auto Test
  var hashString = geohash.encode(44.97, -93.26, geohash.ENCODE_AUTO);
  test.equal(hashString, '9zvxvfd');

  hashString = geohash.encode('44.97', '-93.26', geohash.ENCODE_AUTO);
  test.equal(hashString, '9zvxvfd');

  hashString = geohash.encode('44.978120', '-93.263536', geohash.ENCODE_AUTO);
  test.equal(hashString, '9zvxvsp8d170t');
  test.done();
}

exports.testEncodeAuto = function (test) {
  var hashString;
  //Multi Auto Test
  for (var i = 0; i < 25; i++) {
    var lat = (Math.random() * 180 - 90).toString();
    var lon = (Math.random() * 360 - 180).toString();
    var length = Math.floor(Math.random() * 5);
    lat = lat.substr(0, 5 + length);
    lon = lon.substr(0, 5 + length);

    hashString = geohash.encode(lat, lon, geohash.ENCODE_AUTO);
    latlon = geohash.decode(hashString);

    var decodedLat = latlon.latitude.toString();
    var decodedLon = latlon.longitude.toString();

    var latLength = lat.split('.')[1].length;
    var lonLength = lon.split('.')[1].length;

    var roundedDecodedLat = Math.round(decodedLat * Math.pow(10, latLength)) / Math.pow(10, latLength);
    var roundedDecodedLon = Math.round(decodedLon * Math.pow(10, lonLength)) / Math.pow(10, lonLength);
    for (var j in lat) {
      test.equal(
        lat,
        roundedDecodedLat,
        lat + " didn't equal " + roundedDecodedLat + " (latLength: " + latLength + ")");
      test.equal(
        lon,
        roundedDecodedLon,
        lon + " didn't equal " + roundedDecodedLon + " (lonLength: " + lonLength + ")");
    }
  }
  test.done();
}

exports.testNeighbor = function (test) {
  var north = geohash.neighbor('dqcjq', [1, 0]);
  test.equal(north, 'dqcjw');

  var southwest = geohash.neighbor('DQCJQ', [-1, -1]);
  test.equal(southwest, 'dqcjj');
  test.done();
}

exports.testBBoxes = function (test) {
  var bboxes = geohash.bboxes(30, 120, 30.0001, 120.0001, 8);
  test.equal(bboxes[bboxes.length - 1], geohash.encode(30.0001, 120.0001, 8));
  test.equal(bboxes[bboxes.length - 1], geohash.encode(30.0001, 120.0001, 8));
  test.done();
}
return exports;
