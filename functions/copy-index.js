// include fs-extra package
var fs = require("fs-extra");

var index = ['../client/dist/browser', './dist/browser']

// copy source folder to destination
fs.copy(index[0], index[1], function (err) {
    if (err) {
        return console.error(err)
    }
});
var manifest = ['../client/dist/server', './dist/server']

fs.copy(manifest[0], manifest[1], function (err) {
    if (err) {
        return console.error(err)
    }
});



// var licenses = ['../client/dist/browser/3rdpartylicenses.txt', './dist/browser/3rdpartylicenses.txt']

// fs.copy(licenses[0], licenses[1], function (err) {
//     if (err) {
//         return console.error(err)
//     }
// });

// var assest = ['../client/dist/browser/assets', './dist/browser/assets']

// fs.copy(assest[0], assest[1], function (err) {
//     if (err) {
//         return console.error(err)
//     }
// });

// var robot = ['../client/dist/browser/robots.txt', './dist/browser/robots.txt']

// fs.copy(robot[0], robot[1], function (err) {
//     if (err) {
//         return console.error(err)
//     }
// });
// var robot = ['../client/dist/browser/sitemap.xml', './dist/browser/sitemap.xml']

// fs.copy(robot[0], robot[1], function (err) {
//     if (err) {
//         return console.error(err)
//     }
// });
