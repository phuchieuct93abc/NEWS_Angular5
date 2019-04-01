// include fs-extra package
var fs = require("fs-extra");

var index = ['../client/dist/browser/index.html', './dist/browser/index.html']

// copy source folder to destination
fs.copy(index[0], index[1], function (err) {
    if (err) {
        return console.error(err)
    }
});
var manifest = ['../client/dist/browser/manifest.json', './dist/browser/manifest.json']

fs.copy(manifest[0], manifest[1], function (err) {
    if (err) {
        return console.error(err)
    }
});



var licenses = ['../client/dist/browser/3rdpartylicenses.txt', './dist/browser/3rdpartylicenses.txt']

fs.copy(licenses[0], licenses[1], function (err) {
    if (err) {
        return console.error(err)
    }
});

var assest = ['../client/dist/browser/assets', './dist/browser/assets']

fs.copy(assest[0], assest[1], function (err) {
    if (err) {
        return console.error(err)
    }
});
