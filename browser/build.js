var fs = require('fs');
var path = require('path')

var files = [
  path.join('browser','intro.js'), 
  'main.js', 
  path.join('browser', 'outro.js')
];

var data = files.map(function(file) {
  return fs.readFileSync(file);
});

fs.writeFileSync('browser/geohash.js', data.join('\n'));
