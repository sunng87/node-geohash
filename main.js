/**
 * Copyright (c) 2011, Sun Ning.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

var BASE32_CODES = "0123456789bcdefghjkmnpqrstuvwxyz";
var BASE32_CODES_DICT = {};
for(var i=0; i<BASE32_CODES.length; i++) {
    BASE32_CODES_DICT[BASE32_CODES.charAt(i)]=i;
}

/**
 * Encode
 *
 * Create a Geohash out of a latitude and longitude that is `numberOfChars` long.
 *
 * @param {Number} latitude
 * @param {Number} longitude
 * @param {Number} numberOfChars
 * @returns {String}
 */
var encode = function(latitude, longitude, numberOfChars){
    var chars = [],
		bits = 0,
		bitsTotal = 0,

		hash_value = 0,

		maxlat = 90,
		minlat = -90,
		maxlon = 180,
		minlon = -180,
		mid;
    while(chars.length < numberOfChars) {
        if (bitsTotal % 2 === 0){
            mid = (maxlon+minlon)/2;
            if(longitude > mid){
                hash_value = (hash_value << 1) + 1;
                minlon=mid;
            } else {
                hash_value = (hash_value << 1) + 0;
                maxlon=mid;
            }
        } else {
            mid = (maxlat+minlat)/2;
            if(latitude > mid ){
                hash_value = (hash_value << 1) + 1;
                minlat = mid;
            } else {
                hash_value = (hash_value << 1) + 0;
                maxlat = mid;
            }
        }

        bits++;
		bitsTotal++;
        if (bits === 5) {
            var code = BASE32_CODES[hash_value];
            chars.push(code);
            bits = 0;
            hash_value = 0;
        }
    }
    return chars.join('');
};

/**
 * Encode Integer
 *
 * Create a Geohash out of a latitude and longitude that is of 'bitDepth'.
 *
 * @param {Number} latitude
 * @param {Number} longitude
 * @param {Number} bitDepth
 * @returns {Number}
 */
var encode_int = function(latitude, longitude, bitDepth){

    bitDepth = bitDepth || 52;

    var bitsTotal = 0,
        maxlat = 90,
        minlat = -90,
        maxlon = 180,
        minlon = -180,
        mid,
        combinedBits = 0;

    while(bitsTotal < bitDepth) {
        combinedBits *= 2;
        if (bitsTotal % 2 === 0){
            mid = (maxlon+minlon)/2;
            if(longitude > mid){
                combinedBits += 1;
                minlon=mid;
            } else {
                maxlon=mid;
            }
        } else {
            mid = (maxlat+minlat)/2;
            if(latitude > mid ){
                combinedBits += 1;
                minlat = mid;
            } else {
                maxlat = mid;
            }
        }
        bitsTotal++;
    }
    return combinedBits;
};

/**
 * Decode Bounding Box
 *
 * Decode hashstring into a bound box matches it. Data returned in a four-element array: [minlat, minlon, maxlat, maxlon]
 * @param {String} hash_string
 * @returns {Array}
 */
var decode_bbox = function(hash_string){

    var islon = true;
    var maxlat = 90, minlat = -90;
    var maxlon = 180, minlon = -180;
    var mid = 0;

    var hash_value = 0;
    for(var i=0,l=hash_string.length; i<l; i++) {
        var code = hash_string[i].toLowerCase();
        hash_value = BASE32_CODES_DICT[code];

        for (var bits=4; bits>=0; bits--) {
            var bit = (hash_value >> bits) & 1;
            if (islon){
                mid = (maxlon+minlon)/2;
                if(bit === 1){
                    minlon = mid;
                } else {
                    maxlon = mid;
                }
            } else {
                mid = (maxlat+minlat)/2;
                if(bit === 1){
                    minlat = mid;
                } else {
                    maxlat = mid;
                }
            }
            islon = !islon;
        }
    }
    return [minlat, minlon, maxlat, maxlon];
};

/**
 * Decode Bounding Box Integer
 *
 * Decode hash number into a bound box matches it. Data returned in a four-element array: [minlat, minlon, maxlat, maxlon]
 * @param {Number} hash_int
 * @param {Number} bitDepth
 * @returns {Array}
 */
var decode_bbox_int = function(hash_int, bitDepth){

    bitDepth = bitDepth || 52;

    var bitsTotal = 0;
    var maxlat = 90, minlat = -90;
    var maxlon = 180, minlon = -180;

    var lat_bit = 0, lon_bit = 0;
    var step = bitDepth/2;

    for(var i=0; i<step; i++){

        lon_bit = get_bit(hash_int, ((step-i)*2) - 1 );
        lat_bit = get_bit(hash_int, ((step-i)*2) - 2 );

        if (lat_bit === 0){
            maxlat = (maxlat + minlat) / 2;
        }
        else{
            minlat = (maxlat + minlat) / 2;
        }

        if (lon_bit === 0){
            maxlon = (maxlon + minlon) / 2;
        }
        else{
            minlon = (maxlon + minlon) / 2;
        }
    }
    return [minlat, minlon, maxlat, maxlon];
};

function get_bit(bits, position){
    return (bits / Math.pow(2,position)) & 0x01;
};

/**
 * Decode
 *
 * Decode a hash string into pair of latitude and longitude. A javascript object is returned with keys `latitude`,
 * `longitude` and `error`.
 * @param {String} hash_string
 * @returns {Object}
 */
var decode = function(hash_string){
    var bbox = decode_bbox(hash_string);
    var lat = (bbox[0]+bbox[2])/2;
    var lon = (bbox[1]+bbox[3])/2;
    var laterr = bbox[2]-lat;
    var lonerr = bbox[3]-lon;
    return {latitude:lat, longitude:lon,
        error:{latitude:laterr, longitude:lonerr}};
};

/**
 * Decode Integer
 *
 * Decode a hash integer into a pair of latitude and longitude. A javascript object is returned with keys `latitude`,
 * `longitude` and `error`.
 * @param {Number} hash_int
 * @param {Number} bitDepth
 * @returns {Object}
 */
var decode_int = function(hash_int, bitDepth){
    var bbox = decode_bbox_int(hash_int, bitDepth);
    var lat = (bbox[0]+bbox[2])/2;
    var lon = (bbox[1]+bbox[3])/2;
    var laterr = bbox[2]-lat;
    var lonerr = bbox[3]-lon;
    return {latitude:lat, longitude:lon,
        error:{latitude:laterr, longitude:lonerr}};
};

/**
 * Neighbor
 *
 * Find neighbor of a geohash string in certain direction. Direction is a two-element array, i.e. [1,0] means north, [-1,-1] means southwest.
 * direction [lat, lon], i.e.
 * [1,0] - north
 * [1,1] - northeast
 * ...
 * @param {String} hash_string
 * @returns {Array}
*/
var neighbor = function(hashstring, direction) {
    var lonlat = decode(hashstring);
    var neighbor_lat = lonlat.latitude + direction[0] * lonlat.error.latitude * 2;
    var neighbor_lon = lonlat.longitude + direction[1] * lonlat.error.longitude * 2;
    return encode(neighbor_lat, neighbor_lon, hashstring.length);
};

/**
 * Neighbor Integer
 *
 * Find neighbor of a geohash integer in certain direction. Direction is a two-element array, i.e. [1,0] means north, [-1,-1] means southwest.
 * direction [lat, lon], i.e.
 * [1,0] - north
 * [1,1] - northeast
 * ...
 * @param {String} hash_string
 * @returns {Array}
*/
var neighbor_int = function(hash_int, direction, bitDepth) {
    bitDepth = bitDepth || 52;
    var lonlat = decode_int(hash_int, bitDepth);
    var neighbor_lat = lonlat.latitude + direction[0] * lonlat.error.latitude * 2;
    var neighbor_lon = lonlat.longitude + direction[1] * lonlat.error.longitude * 2;
    return encode_int(neighbor_lat, neighbor_lon, bitDepth);
};

/**
 * Bounding Boxes
 *
 * Return all the hashstring between minLat, minLon, maxLat, maxLon in numberOfChars
 * @param {Number} minLat
 * @param {Number} minLon
 * @param {Number} maxLat
 * @param {Number} maxLon
 * @param {Number} numberOfChars
 * @returns {bboxes.hashList|Array}
 */
var bboxes = function(minLat, minLon, maxLat, maxLon, numberOfChars){
    numberOfChars = numberOfChars || 9;

    var hashSouthWest = encode(minLat, minLon, numberOfChars);
    var hashNorthEast = encode(maxLat, maxLon, numberOfChars);

    var latlon = decode(hashSouthWest);

    var perLat = latlon.error.latitude * 2;
    var perLon = latlon.error.longitude * 2;

    var boxSouthWest = decode_bbox(hashSouthWest);
    var boxNorthEast = decode_bbox(hashNorthEast);

    var latStep = Math.round((boxNorthEast[0] - boxSouthWest[0])/perLat);
    var lonStep = Math.round((boxNorthEast[1] - boxSouthWest[1])/perLon);

    var hashList = [];

    for(var lat = 0; lat <= latStep; lat++){
        for(var lon = 0; lon <= lonStep; lon++){
            hashList.push(neighbor(hashSouthWest,[lat, lon]));
        }
    }

    return hashList;
};


/**
 * Bounding Boxes Integer
 *
 * Return all the hash integers between minLat, minLon, maxLat, maxLon in bitDepth
 * @param {Number} minLat
 * @param {Number} minLon
 * @param {Number} maxLat
 * @param {Number} maxLon
 * @param {Number} bitDepth
 * @returns {bboxes_int.hashList|Array}
 */
var bboxes_int = function(minLat, minLon, maxLat, maxLon, bitDepth){
    bitDepth = bitDepth || 52;

    var hashSouthWest = encode_int(minLat, minLon, bitDepth);
    var hashNorthEast = encode_int(maxLat, maxLon, bitDepth);

    var latlon = decode_int(hashSouthWest, bitDepth);

    var perLat = latlon.error.latitude * 2;
    var perLon = latlon.error.longitude * 2;

    var boxSouthWest = decode_bbox_int(hashSouthWest, bitDepth);
    var boxNorthEast = decode_bbox_int(hashNorthEast, bitDepth);

    var latStep = Math.round((boxNorthEast[0] - boxSouthWest[0])/perLat);
    var lonStep = Math.round((boxNorthEast[1] - boxSouthWest[1])/perLon);

    var hashList = [];

    for(var lat = 0; lat <= latStep; lat++){
        for(var lon = 0; lon <= lonStep; lon++){
            hashList.push(neighbor_int(hashSouthWest,[lat, lon], bitDepth));
        }
    }

    return hashList;
};


/**
 * Neighbors
 *
 * Returns all neighbors' hashstrings clockwise from north around to northwest
 * 7 0 1
 * 6 x 2
 * 5 4 3
 * @param {String} hash_string
 * @returns {encoded neighborHashList|Array}
 */
var neighbors = function(hash_string){

    var hashstringLength = hash_string.length;

    var lonlat = decode(hashstring);
    var lat = lonlat.latitude;
    var lon = lonlat.longitude;
    var latErr = lonlat.error.latitude * 2;
    var lonErr = lonlat.error.longitude * 2;

    var neighbor_lat,
        neighbor_lon;

    var neighborHashList = [
                            encodeNeighbor(1,0),
                            encodeNeighbor(1,1),
                            encodeNeighbor(0,1),
                            encodeNeighbor(-1,1),
                            encodeNeighbor(-1,0),
                            encodeNeighbor(-1,-1),
                            encodeNeighbor(0,-1),
                            encodeNeighbor(1,-1)
                            ];

    function encodeNeighbor_int(neighborLatDir, neighborLonDir){
        neighbor_lat = lat + neighborLatDir * latErr * 2;
        neighbor_lon = lon + neighborLonDir * lonErr * 2;
        return encode(neighbor_lat, neighbor_lon, hashstringLength);
    }

    return neighborHashList;
};

/**
 * Neighbors Integer
 *
 * Returns all neighbors' hash integers clockwise from north around to northwest
 * 7 0 1
 * 6 x 2
 * 5 4 3
 * @param {Number} hash_int
 * @param {Number} bitDepth
 * @returns {encode_int'd neighborHashIntList|Array}
 */
var neighbors_int = function(hash_int, bitDepth){

    bitDepth = bitDepth || 52;

    var lonlat = decode_int(hash_int, bitDepth);
    var lat = lonlat.latitude;
    var lon = lonlat.longitude;
    var latErr = lonlat.error.latitude * 2;
    var lonErr = lonlat.error.longitude * 2;

    var neighbor_lat,
        neighbor_lon;

    var neighborHashIntList = [
                            encodeNeighbor_int(1,0),
                            encodeNeighbor_int(1,1),
                            encodeNeighbor_int(0,1),
                            encodeNeighbor_int(-1,1),
                            encodeNeighbor_int(-1,0),
                            encodeNeighbor_int(-1,-1),
                            encodeNeighbor_int(0,-1),
                            encodeNeighbor_int(1,-1)
                            ];

    function encodeNeighbor_int(neighborLatDir, neighborLonDir){
        neighbor_lat = lat + neighborLatDir * latErr * 2;
        neighbor_lon = lon + neighborLonDir * lonErr * 2;
        return encode_int(neighbor_lat, neighbor_lon, bitDepth);
    }

    return neighborHashIntList;
};


var geohash = {
    'encode': encode,
    'encode_uint64': encode_int, // keeping for backwards compatibility, will deprecate
    'encode_int': encode_int,
    'decode': decode,
    'decode_int': decode_int,
    'decode_uint64': decode_int, // keeping for backwards compatibility, will deprecate
    'decode_bbox': decode_bbox,
    'decode_bbox_uint64': decode_bbox_int, // keeping for backwards compatibility, will deprecate
    'decode_bbox_int': decode_bbox_int,
    'neighbor': neighbor,
    'neighbor_int': neighbor_int,
    'neighbors': neighbors,
    'neighbors_int': neighbors_int,
    'bboxes': bboxes,
    'bboxes_int': bboxes_int
};

module.exports = geohash;

