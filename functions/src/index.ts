import * as functions from 'firebase-functions';
import StoryServiceFactory from "./StoryServiceFactory";
import ArticleServiceFactory from "./ArticleServiceFactory";
import Article from "../../model/Article";
import {Story} from "../../model/Story";

const express = require('express');
var compression = require('compression');


const app = express();
const port = 3000;
const cors = require('cors');
var timeout = require('connect-timeout');

app.use(timeout('300s'));

app.use(compression());
app.use(cors());
app.get('/story', (req, res) => {
    StoryServiceFactory.get('vi').getStories(req.query.pageNumber, req.query.category).then(stories => res.send(stories))
});


app.get('/article', (req, res) => {
    ArticleServiceFactory.get("vi").getArticleById(req.query.url).then(article => res.send(article))
});

app.get('/cachestory', (req, res) => {
    let allPromise = [];
    StoryServiceFactory.get('vi').getStories(req.query.pageNumber, req.query.category).then(stories => {
        var promise = cacheArticle(stories[0].originalUrl);
        for (var i = 1; i < stories.length; i++) {
            promise = (function (story: Story) {
                return promise.then(() => {
                    return cacheArticle(story.originalUrl)
                });
            })(stories[i]);
        }


        promise.then(value => {
            res.send("ok");
        })

    })
});
const cacheArticle = function (url): Promise<Article> {
    return ArticleServiceFactory.get("vi").crawnArticleByIdAndSaveArticle(url)
};


app.listen(port, () => console.log(`Example app listening on port ${port}!`));


exports.app = functions.runWith({
    timeoutSeconds: 540, memory: '1GB'

}).https.onRequest(app);

