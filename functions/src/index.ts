import * as functions from 'firebase-functions';
import StoryServiceFactory from "./story/StoryServiceFactory";
import ArticleServiceFactory from "./article/ArticleServiceFactory";

const express = require('express');
const compression = require('compression');


const app = express();
const port = 3000;
const cors = require('cors');
const timeout = require('connect-timeout');

app.use(timeout('300s'));

app.use(compression());
app.use(cors());


app.get('/story', (req, res) => {
    StoryServiceFactory.get(req.query.lang).getStories(req.query.pageNumber, req.query.category).then(stories => res.send(stories))
});


app.get('/article', (req, res) => {
    ArticleServiceFactory.get("vi").getArticleById(req.query.url).then(article => res.send(article))
});

app.get('/cachestory', (req, res) => {


    StoryServiceFactory.get('vi').cache(req.query.pageNumber, req.query.category).then(() => {
        res.send("ok");

    })
});

app.get('/search', (req, res) => {

    StoryServiceFactory.get('vi').search(req.query.pageNumber, req.query.keyword).then((value) => {
        res.send(value);

    })
});
app.get('/getSource', (req, res) => {

    ArticleServiceFactory.get('vi').getSource(req.query.url).then((value) => {
        res.send({url:value});

    })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


exports.app = functions.runWith({
    timeoutSeconds: 540,
    memory: '1GB'

}).region("asia-northeast1").https.onRequest(app);

