node-geohash
============

Geohash library for nodejs.

Install
-------

    npm install ngeohash

Usage
-----

    var geohash = require('geohash');
    sys.puts(geohash.encode(37.8324, 112.5584));
    // prints ww8p1r4t8
    var latlon = geohash.decode('ww8p1r4t8');
    sys.puts(latlon.latitude);
    sys.puts(latlon.longitude);

### geohash.encode (latitude, longitude, precision=9)

Encode a pair of latitude and longitude into geohash. The third argument is
optional, you can specify a length of this hash string, which also affect on
the precision of the geohash.

### geohash.decode (hashstring)

Decode a hash string into pair of latitude and longitude. A javascript object
is returned with key `latitude` and `longitude`.

### geohash.neighbor (hashstring, direction)

Find neighbor of a geohash string in certain direction. Direction is a 
two-element array, i.e. [1,0] means north, [-1,-1] means southwest.

### geohash.decode_bbox (hashstring)

Decode hashstring into a bound box matches it. Data returned in a four-element
array: [minlat, minlon, maxlat, maxlon]

About Geohash
-------------

Check [Wikipedia](http://en.wikipedia.org/wiki/Geohash "Wiki page for geohash")
for more information.
    

