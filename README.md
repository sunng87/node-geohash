node-geohash
============

Geohash library for nodejs.

[![Build Status](https://travis-ci.org/sunng87/node-geohash.svg)](https://travis-ci.org/sunng87/node-geohash)

## Install

```bash
npm install ngeohash
```


## Usage

```javascript
var geohash = require('ngeohash');
console.log(geohash.encode(37.8324, 112.5584));
// prints ww8p1r4t8
var latlon = geohash.decode('ww8p1r4t8');
console.log(latlon.latitude);
console.log(latlon.longitude);
```


## Basic Methods

### geohash.encode (latitude, longitude, precision=9)

Encode a pair of latitude and longitude values into a geohash. The third argument is optional, you can specify a length of this hash string, which also affects the precision of the geohash.


### geohash.decode (hashstring)

Decode a hash string into pair of latitude and longitude values. A javascript object is returned with `latitude` and `longitude` keys.


### geohash.decode_bbox (hashstring)

Decode hashstring into a bounding box that matches it. Data is returned as a four-element array: `[minlat, minlon, maxlat, maxlon]`.


### geohash.bboxes (minlat, minlon, maxlat, maxlon, precision=9)

Get all hashstringes between `[minlat, minlon]` and `[maxlat, maxlon]`. These keys can be used to find a poi stored in the cache with hashstring keys. eg. show all points in the visible range of map


### geohash.neighbor (hashstring, direction)

Find the neighbor of a geohash string in certain direction. Direction is a two-element array, i.e. `[1,0]` means north, `[-1,-1]` means southwest.


### geohash.neighbors (hashstring)

Find all 8 geohash neighbors `[n, ne, e, se, s, sw, w, nw]` of a geohash string. This method is more efficient than running the geohash.neighbor method multiple times for all directions. array: `[hashstr1, hashstr2, ... ]`




## Integer Methods

Note that integer precision is capped at 52bits in Javscript. These are just regular javascript floating point numbers, but the functionality should mimic other uint64 geohash functions in geohash libraries for other languages and are compatible with the geohash integers produced by them, however any geohash integer encoded in anything more than 52bits will be resolved to 52bits resolution.


### geohash.encode_int (latitude, longitude, bitDepth=52)

Encode a pair of latitude and longitude values into a geohash integer. The third argument is optional, you can specify the `bitDepth` of this number, which affects the precision of the geohash but also **must be used consistently when decoding**. Bit depth must be even.


### geohash.decode_int (hashinteger, bitDepth=52)

Decode a integer geohashed number into pair of latitude and longitude value approximations. A javascript object is returned with `latitude` and `longitude` keys. You should also provide the `bitDepth` at which to decode the number (ie. what bitDepth the number was originally produced with), but will default to 52.


### geohash.decode_bbox_int (hashinteger, bitDepth=52)

Decode an integer geohash into the bounding box that matches it. Data is returned as a four-element array: `[minlat, minlon, maxlat, maxlon]`.


### geohash.bboxes_int (minlat, minlon, maxlat, maxlon, bitDepth=52)

Get all geohash integers between `[minlat, minlon]` and `[maxlat, maxlon]`. These keys can be used to find a poi stored in the cache with geohash integer keys. eg. show all points in the visible range of map


### geohash.neighbor_int (hashinteger, direction, bitDepth=52)

Find the neighbor of a geohash integer in certain direction. Direction is a two-element array, i.e. `[1,0]` means north, `[-1,-1]` means southwest. The `bitDepth` should be specified, but defaults to 52 bits.


### geohash.neighbors_int (hashinteger, bitDepth=52)

Find all 8 neighbors `[n, ne, e, se, s, sw, w, nw]` of a geohash integer. This method is more efficient than running the geohash.neighbor method multiple times for all directions. The `bitDepth` should be specified, but defaults to 52 bits.



## About Geohash

Check [Wikipedia](http://en.wikipedia.org/wiki/Geohash "Wiki page for geohash") for more information.



## Contributors

* [Seth Miller](https://github.com/four43)
* [Zhu Zhe](https://github.com/zhuzhe1983)
* [Arjun Mehta](https://github.com/arjunmehta)



## License

node-geohash is open sourced under MIT License, of course.
