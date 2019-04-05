import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
// // Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// // Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import {join} from 'path';
import * as functions from 'firebase-functions';
import StoryServiceFactory from "./src/story/StoryServiceFactory";
import ArticleServiceFactory from "./src/article/ArticleServiceFactory";

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser

app.get('*.*', express.static(DIST_FOLDER,{
    maxAge:'1y'
}));
// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', {req});
});


// Start up the Node server
// app.listen(PORT, () => {
//   console.log(`Node Express server listening on http://localhost:${PORT}`);
// });
const api = express();

const compression = require('compression');


const cors = require('cors');
const sharp = require('sharp');
const request = require('request');


api.use(compression());
api.use(cors());


api.get('/story', (req, res) => {
    StoryServiceFactory.get(req.query.lang).getStories(req.query.pageNumber, req.query.category).then(stories => res.send(stories))
});


api.get('/article', (req, res) => {
    ArticleServiceFactory.get("vi").getArticleById(req.query.url).then(article => res.send(article))
});
api.get('/comments', (req, res) => {
    ArticleServiceFactory.get("vi").getComment(req.query.id).then(article => res.send(article))
});
api.get('/cachestory', (req, res) => {

    StoryServiceFactory.get('vi').cache(req.query.pageNumber, req.query.category).then(() => {
        res.send("ok");

    })
});

api.get('/search', (req, res) => {

    StoryServiceFactory.get('vi').search(req.query.pageNumber, req.query.keyword).then((value) => {
        res.send(value);

    })
});
api.get('/getSource', (req, res) => {

    ArticleServiceFactory.get('vi').getSource(req.query.id).then((value) => {
        res.send({url: value});

    })
});
api.get('/blur', (req, res) => {

    request({url: req.query.url, encoding: null}, function (err2, res2, bodyBuffer) {
        sharp(bodyBuffer).blur(5).overlayWith(
            new Buffer([0, 0, 0, 128]),
            {tile: true, raw: {width: 1, height: 1, channels: 4}}
        ).jpeg().toBuffer().then(output => {
            res.set('Content-Type', 'image/jpeg');
            res.send(output)
        })
    });


});


exports.app = functions.runWith({
    timeoutSeconds: 15,
    memory: '512MB'

}).https.onRequest(app);



exports.api = functions.runWith({
    timeoutSeconds: 15,
    memory: '512MB'

}).region("asia-northeast1").https.onRequest(api);

