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

return exports;
