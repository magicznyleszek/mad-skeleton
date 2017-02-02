var fs = require('fs');
var gm = require('gm');

gm('src/images/test/medieval-blood-and-gore.jpg')
.resize(240, 240)
.write('dist/images/test/medieval-blood-and-gore-small.jpg', function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log('done');
    }
});
