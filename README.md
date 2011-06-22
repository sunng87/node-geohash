node-geohash
============

Geohash library for nodejs.

Usage
-----

    var geohash = require('geohash');
    sys.puts(geohash.encode(37.8324, 112.5584));
    // prints ww8p1r4t8
    var latlon = geohash.decode('ww8p1r4t8');
    sys.puts(latlon.latitude);
    sys.puts(latlon.longitude);

### geohash.encode 

Encode a pair of latitude and longitude into geohash. The third argument is
optional, you can specify a length of this hash string, which also affect on
the precision of the geohash.

### geohash.decode

Decode a hash string into pair of latitude and longitude. A javascript object
is returned with key `latitude` and `longitude`.


About Geohash
-------------

Check [Wikipedia](http://en.wikipedia.org/wiki/Geohash "Wiki page for geohash")
for more information.
    

