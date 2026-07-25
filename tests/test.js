var geohash = require('../');
var test = require('assert');

var longitude = 112.5584;
var latitude = 37.8324;

exports.testEncodeBasic = function (test) {
  var hashString = geohash.encode(37.8324, 112.5584);
  test.equal(hashString, 'ww8p1r4t8');

  hashString = geohash.encode(32, 117, 3);
  test.equal(hashString, 'wte');
  test.done();
};

exports.testIntEncodeBasic = function (test) {
  var hashStringUInt = geohash.encode_int(37.8324, 112.5584, 52);
  test.equal(hashStringUInt, 4064984913515641);
  test.done();
};

exports.testDecodeBasic = function (test) {
  var latLon = geohash.decode('ww8p1r4t8');
  test.ok(Math.abs(37.8324 - latLon.latitude) < 0.0001);
  test.ok(Math.abs(112.5584 - latLon.longitude) < 0.0001);
  test.done();
};

exports.testDecodeIntBasic = function (test) {
  var latLonUInt = geohash.decode_int(4064984913515641);
  test.ok(Math.abs(37.8324 - latLonUInt.latitude) < 0.0001, "(37.8324 - "+latLonUInt.latitude+" was >= 0.0001");
  test.ok(Math.abs(112.5584 - latLonUInt.longitude) < 0.0001, "(112.5584 - "+latLonUInt.longitude+" was >= 0.0001");
  test.done();
};

exports.teshEncodeAutoBasic = function (test) {
  //Simple Auto Test
  test.throws(function(){
    geohash.encode(44.97, -93.26, geohash.ENCODE_AUTO);
  });

  hashString = geohash.encode('44.97', '-93.26', geohash.ENCODE_AUTO);
  test.equal(hashString, '9zvxvfd');

  hashString = geohash.encode('44.978120', '-93.263536', geohash.ENCODE_AUTO);
  test.equal(hashString, '9zvxvsp8d170t');
  test.done();
};

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
};

exports.testNeighbor = function (test) {
  var north = geohash.neighbor('dqcjq', [1, 0]);
  test.equal(north, 'dqcjw');

  var southwest = geohash.neighbor('DQCJQ', [-1, -1]);
  test.equal(southwest, 'dqcjj');
  
  var northEast = geohash.neighbor('r', [1, 1]);
  test.equal(northEast, '8');

  var east = geohash.neighbor('r', [0, 1]);
  test.equal(east, '2');
  
  var southEast = geohash.neighbor('r', [-1, 1]);
  test.equal(southEast, '0');

  test.done();
};

exports.testNeighborInt = function (test) {
  var north = geohash.neighbor_int(1702789509, [1, 0], 32);
  test.equal(north, 1702789520);

  var southwest = geohash.neighbor_int(27898503327470, [-1, -1], 46);
  test.equal(southwest, 27898503327465);
  test.done();
};

exports.testNeighbors = function (test) {
  var neighbors = geohash.neighbors('dqcjq');
  var neighbor_test = ['dqcjw','dqcjx','dqcjr','dqcjp','dqcjn','dqcjj','dqcjm','dqcjt'];
  for(var i=0; i<neighbors.length; i++){
    test.equal(neighbors[i], neighbor_test[i]);
  }
  test.equal(neighbors[0], geohash.neighbor('dqcjq', [1, 0]));

  neighbors = geohash.neighbors('DQCJQ');
  neighbor_test = ['dqcjw','dqcjx','dqcjr','dqcjp','dqcjn','dqcjj','dqcjm','dqcjt'];
  for(i=0; i<neighbors.length; i++){
    test.equal(neighbors[i], neighbor_test[i]);
  }
  test.equal(neighbors[5], geohash.neighbor('DQCJQ', [-1, -1]));

  neighbors = geohash.neighbors('21202')
  neighbor_test = ['21208', '21209', '21203', '21201', '21200', 'rcrbp', 'rcrbr', 'rcrbx']
  for (i = 0; i < neighbors.length; i++) {
    test.equal(neighbors[i], neighbor_test[i]);
  }
  test.equal(neighbors[6], geohash.neighbor('21202', [0, -1]));

  test.done();
};

exports.testNeighborsInt = function (test) {
  var neighbors = geohash.neighbors_int(1702789509, 32);
  var neighbor_test = [ 1702789520,1702789522,1702789511,1702789510,1702789508,1702789422,1702789423,1702789434 ];
  for(var i=0; i<neighbors.length; i++){
    test.equal(neighbors[i], neighbor_test[i]);
  }
  test.equal(neighbors[0], geohash.neighbor_int(1702789509, [1, 0]));

  neighbors = geohash.neighbors_int(27898503327470, 46);
  neighbor_test = [ 27898503327471,27898503349317,27898503349316,27898503349313,27898503327467,27898503327465,27898503327468,27898503327469 ];
  for(i=0; i<neighbors.length; i++){
    test.equal(neighbors[i], neighbor_test[i]);
  }
  test.equal(neighbors[5], geohash.neighbor_int(27898503327470, [-1, -1]));
  test.done();
};

exports.testBBoxes = function (test) {
  var bboxes = geohash.bboxes(30, 120, 30.0001, 120.0001, 8);
  test.equal(bboxes[bboxes.length - 1], geohash.encode(30.0001, 120.0001, 8));
  test.equal(bboxes[bboxes.length - 1], geohash.encode(30.0001, 120.0001, 8));
  test.done();
};

exports.testBBoxesInt = function (test) {
  var bboxes = geohash.bboxes_int(30, 120, 30.0001, 120.0001, 50);
  test.equal(bboxes[bboxes.length - 1], geohash.encode_int(30.0001, 120.0001, 50));
  test.equal(bboxes[bboxes.length - 1], geohash.encode_int(30.0001, 120.0001, 50));
  test.done();
};

// --- Regression tests for odd bitDepth integer decode (Fix A) ---
// Geohash interleaves bits longitude-first, so a bitDepth of bd has
// ceil(bd/2) longitude bits and floor(bd/2) latitude bits. Any odd-length
// geohash string maps to an odd bitDepth (5*L), which previously produced a
// latitude bbox half the correct height. These tests pin the integer path to
// the library's own (chrisveness-cross-checked) string path.

var BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
function strToInt(hashStr) {
  var v = 0;
  for (var i = 0; i < hashStr.length; i++) {
    v = v * 32 + BASE32.indexOf(hashStr[i]);
  }
  return v;
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

// (a) All 32 single-char geohashes: decode_int(int(c), 5) must equal decode(c).
exports.testOddBitDepthSingleCharDecodeInt = function (test) {
  var chars = BASE32.split('');
  for (var i = 0; i < chars.length; i++) {
    var c = chars[i];
    var ds = geohash.decode(c);
    var di = geohash.decode_int(strToInt(c), 5);
    test.ok(near(ds.latitude, di.latitude, 1e-9),
      'char "' + c + '" lat str=' + ds.latitude + ' int=' + di.latitude);
    test.ok(near(ds.longitude, di.longitude, 1e-9),
      'char "' + c + '" lon str=' + ds.longitude + ' int=' + di.longitude);
  }
  test.done();
};

// (b) Odd vs even length prefixes: decode_bbox_int(int, 5*L) must match
//     decode_bbox(str) for every L, including odd L (previously lat half).
exports.testOddEvenPrefixBboxIntMatchesString = function (test) {
  var sample = geohash.encode(37.8324, 112.5584, 12);
  for (var L = 1; L <= 12; L++) {
    var h = sample.substr(0, L);
    var bd = 5 * L;
    var sb = geohash.decode_bbox(h);
    var ib = geohash.decode_bbox_int(strToInt(h), bd);
    test.ok(near(sb[0], ib[0], 1e-9), 'L=' + L + ' minlat str=' + sb[0] + ' int=' + ib[0]);
    test.ok(near(sb[1], ib[1], 1e-9), 'L=' + L + ' minlon str=' + sb[1] + ' int=' + ib[1]);
    test.ok(near(sb[2], ib[2], 1e-9), 'L=' + L + ' maxlat str=' + sb[2] + ' int=' + ib[2]);
    test.ok(near(sb[3], ib[3], 1e-9), 'L=' + L + ' maxlon str=' + sb[3] + ' int=' + ib[3]);
  }
  test.done();
};

// (c) neighbor_int at odd bitDepth must agree with the string neighbor.
exports.testNeighborIntOddBitDepthConsistent = function (test) {
  var base = 'j';
  var ni = geohash.neighbor_int(strToInt(base), [1, 0], 5);
  var ns = geohash.neighbor(base, [1, 0]);
  var niLat = geohash.decode_int(ni, 5).latitude;
  var nsLat = geohash.decode(ns).latitude;
  test.ok(near(niLat, nsLat, 1e-6),
    'neighbor_int lat=' + niLat + ' vs neighbor lat=' + nsLat);
  // also a direct numeric guard: int("j")=17, north neighbor -> 19 ("m")
  test.equal(ni, 19);
  test.equal(ns, 'm');
  test.done();
};

// (d) Even-bitDepth regression guard: cell sizes must equal the analytic
//     180/2^(bd/2) (lat) and 360/2^(bd/2) (lon), unchanged by the fix.
exports.testEvenBitDepthCellSizesUnchanged = function (test) {
  for (var bd = 2; bd <= 52; bd += 2) {
    var expLatH = 180 / Math.pow(2, bd / 2);
    var expLonW = 360 / Math.pow(2, bd / 2);
    var enc = geohash.encode_int(37.8324, 112.5584, bd);
    var bb = geohash.decode_bbox_int(enc, bd);
    test.ok(near(bb[2] - bb[0], expLatH, 1e-6),
      'bd=' + bd + ' latH=' + (bb[2] - bb[0]) + ' exp=' + expLatH);
    test.ok(near(bb[3] - bb[1], expLonW, 1e-6),
      'bd=' + bd + ' lonW=' + (bb[3] - bb[1]) + ' exp=' + expLonW);
  }
  test.done();
};

// (e) Round-trip encode_int / decode_int for even bitDepth stays within one
//     cell; also covers a couple of odd bitDepths now that they are correct.
exports.testEncodeDecodeIntRoundTrip = function (test) {
  var bds = [2, 4, 10, 25, 26, 50, 52, 5, 15];
  for (var i = 0; i < bds.length; i++) {
    var bd = bds[i];
    var lat = 37.8324, lon = 112.5584;
    var enc = geohash.encode_int(lat, lon, bd);
    var dec = geohash.decode_int(enc, bd);
    var latErr = dec.error.latitude;
    var lonErr = dec.error.longitude;
    test.ok(near(dec.latitude, lat, latErr + 1e-9),
      'bd=' + bd + ' lat=' + dec.latitude + ' exp~' + lat);
    test.ok(near(dec.longitude, lon, lonErr + 1e-9),
      'bd=' + bd + ' lon=' + dec.longitude + ' exp~' + lon);
  }
  test.done();
};

// (f) neighbors_int at odd bitDepth must agree with the string neighbors list
//     (decoded centers), for every direction. These were fixed transitively via
//     decode_int -> decode_bbox_int; this pins them directly.
exports.testNeighborsIntOddBitDepthConsistent = function (test) {
  var baseStr = geohash.encode(37.8324, 112.5584, 1); // odd length -> bd=5
  var bd = 5;
  var baseInt = strToInt(baseStr);
  var nStr = geohash.neighbors(baseStr);   // [n, ne, e, se, s, sw, w, nw]
  var nInt = geohash.neighbors_int(baseInt, bd);
  test.equal(nStr.length, nInt.length, 'neighbor count mismatch');
  for (var i = 0; i < nStr.length; i++) {
    var ds = geohash.decode(nStr[i]);
    var di = geohash.decode_int(nInt[i], bd);
    test.ok(near(ds.latitude, di.latitude, 1e-9),
      'idx=' + i + ' lat str=' + ds.latitude + ' int=' + di.latitude);
    test.ok(near(ds.longitude, di.longitude, 1e-9),
      'idx=' + i + ' lon str=' + ds.longitude + ' int=' + di.longitude);
  }
  test.done();
};

// (g) bboxes_int at odd bitDepth must return the same set of cells as the
//     string bboxes() for the corresponding numberOfChars (bd = 5 * L).
exports.testBBoxesIntOddBitDepthMatchesString = function (test) {
  var bd = 5;
  var numberOfChars = 1;
  var minLat = 0, minLon = 0, maxLat = 80, maxLon = 120;
  var intHashes = geohash.bboxes_int(minLat, minLon, maxLat, maxLon, bd);
  var strHashes = geohash.bboxes(minLat, minLon, maxLat, maxLon, numberOfChars);
  test.equal(strHashes.length, intHashes.length,
    'count str=' + strHashes.length + ' int=' + intHashes.length);
  function key(c) { return c.latitude.toFixed(6) + ',' + c.longitude.toFixed(6); }
  var strKeys = {};
  for (var i = 0; i < strHashes.length; i++) {
    strKeys[key(geohash.decode(strHashes[i]))] = true;
  }
  for (var j = 0; j < intHashes.length; j++) {
    var k = key(geohash.decode_int(intHashes[j], bd));
    test.ok(strKeys[k], 'int cell ' + k + ' has no matching string cell');
  }
  test.done();
};

return exports;
