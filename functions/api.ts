// Start up the Node server
import * as express from 'express';


import StoryServiceFactory from "./src/story/StoryServiceFactory";
import ArticleServiceFactory from "./src/article/ArticleServiceFactory";
import DiffbotService from "./utils/diffbot.service";

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
    ArticleServiceFactory.get("vi").getArticleById(req.query.url).then(article => res.send(article))
});
api.get('/comments', (req, res) => {
    ArticleServiceFactory.get("vi").getComment(req.query.id).then(article => res.send(article))
});
api.get('/cachestory', (req, res) => {

    StoryServiceFactory.get(req).cache().then(() => {
        res.send("ok");

    })
});

api.get('/search', (req, res) => {

    StoryServiceFactory.get(req).search(req.query.pageNumber, req.query.keyword).then((value) => {
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


// regular function

api.get('/pocket', (req, res) => {
    new DiffbotService(req.query.url).get().then(result => {

        res.send(result.objects[0].html)
    })


});

api.listen(3000, () => {
    console.log(`Node Express server listening on http://localhost:${3000}`);
});

export default api;
