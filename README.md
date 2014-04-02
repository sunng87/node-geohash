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

## basic methods

### geohash.encode (latitude, longitude, precision=9)

Encode a pair of latitude and longitude values into a geohash. The third argument is optional, you can specify a length of this hash string, which also affects the precision of the geohash.

### geohash.decode (hashstring)

Decode a hash string into pair of latitude and longitude values. A javascript object is returned with `latitude` and `longitude` keys.

### geohash.neighbor (hashstring, direction)

Find the neighbor of a geohash string in certain direction. Direction is a two-element array, i.e. `[1,0]` means north, `[-1,-1]` means southwest.

### geohash.decode_bbox (hashstring)

Decode hashstring into a bounding box that matches it. Data is returned as a four-element array: `[minlat, minlon, maxlat, maxlon]`.

### geohash.bboxes (minlat, minlon, maxlat, maxlon, precision=9)
Get all hashstringes between `[minlat, minlon]` and `[maxlat, maxlon]`. These keys can be used to find a poi stored in the cache with hashstring keys. eg. show all points in the visible range of map

array: `[hashstr1, hashstr2, ... ]`


## uint64 methods

Note that these are of course not actually uint64 numbers. They are just regular javascript floating point numbers, but the functionality should mimic other uint64 geohash functions in geohash libraries for other languages.

### geohash.encode_uint64 (latitude, longitude, bitDepth=52)

Encode a pair of latitude and longitude values into a uint64-like number geohash. The third argument is optional, you can specify the `bitDepth` of this number, which affects the precision of the geohash but also must be used consistently when decoding. Bit depth must be even.

### geohash.decode_uint64 (hashnumber, bitDepth=52)

Decode a uint64-like hashed number into pair of latitude and longitude values. A javascript object is returned with `latitude` and `longitude` keys. You should also provide the `bitDepth` at which to decode the number (ie. what bitDepth the number was originally produced with), but will default to 52.

### geohash.decode_bbox_uint64 (hashnumber, bitDepth=52)

Decode uint64-like hash into a bounding box that matches it. Data is returned as a four-element array: `[minlat, minlon, maxlat, maxlon]`.

## About Geohash

Check [Wikipedia](http://en.wikipedia.org/wiki/Geohash "Wiki page for geohash") for more information.

## Contributors

* [Seth Miller](https://github.com/four43)
* [Zhu Zhe](https://github.com/zhuzhe1983)
* [Arjun Mehta](https://github.com/arjunmehta)

## License

node-geohash is open sourced under MIT License, of course.
