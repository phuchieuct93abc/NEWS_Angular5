// Start up the Node server
import * as express from 'express';


import StoryServiceFactory from "./src/story/StoryServiceFactory";
import ArticleServiceFactory from "./src/article/ArticleServiceFactory";
import notifyHandler from "./src/notification/notificationHandler";

const api = express();

const compression = require('compression');


const cors = require('cors');
const sharp = require('sharp');
const request = require('request');


api.use(compression());
api.use(cors());


api.get('/story', (req, res) => {
    StoryServiceFactory.get(req).getStories().then(stories => res.send(stories))
});


api.get('/article', (req, res) => {
    ArticleServiceFactory.get(req).getArticleById(req.query.url as string).then(article => res.send(article))
});
api.get('/comments', (req, res) => {
    ArticleServiceFactory.get(req).getComment(req.query.id as string).then(article => res.send(article))
});
api.get('/cachestory', (req, res) => {

    StoryServiceFactory.get(req).cache().then((result) => {
        res.send({articles: result, number: result.length});

    })
});

api.get('/search', (req, res) => {

    StoryServiceFactory.get(req).search(req.query.pageNumber as string,  req.query.keyword as string).then((value) => {
        res.send(value);

    })
});
api.get('/getSource', (req, res) => {

    ArticleServiceFactory.get(req).getSource(req.query.id as string).then((value) => {
        res.send({url: value});

    })
});
api.get('/blur', (req, res) => {
    request({url: req.query.url, encoding: null}, function (err2, res2, bodyBuffer) {

        try {
            let buffer = sharp(bodyBuffer).blur(5).overlayWith(
                new Buffer([0, 0, 0, 128]),
                {tile: true, raw: {width: 1, height: 1, channels: 4}}
            ).jpeg()

            buffer.toBuffer().then(output => {
                res.set('Content-Type', 'image/jpeg');
                res.set('Cache-Control', 'public, max-age=31557600')
                res.send(output)
            })
        } catch (e) {
            console.error(e)
            res.send(null);

        }
    });


});
//Proxy:
var proxy = require('express-http-proxy');

api.get('/icon_publishers/*', proxy('http://s.baomoi.xdn.vn/',{
    userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
      // recieves an Object of headers, returns an Object of headers.
      headers['Cache-Control'] = 'public, max-age=31557600';
      return headers;
    }
  }) );

 

// regular function
api.use(express.json());       // to support JSON-encoded bodies
api.use(express.urlencoded());


notifyHandler(api);
api.listen(3001, () => {
    console.log(`Node Express server listening on http://localhost:${3001}`);
});

export default api;