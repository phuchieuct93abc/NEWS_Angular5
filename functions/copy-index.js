// include fs-extra package
var fs = require("fs-extra");

var index = ['../news/dist/news/browser', './dist/browser']

// copy source folder to destination
fs.copy(index[0], index[1], function (err) {
    if (err) {
        return console.error(err)
    }
});
var manifest = ['../news/dist/news/server', './dist/server']

fs.copy(manifest[0], manifest[1], function (err) {
    if (err) {
        return console.error(err)
    }
});
