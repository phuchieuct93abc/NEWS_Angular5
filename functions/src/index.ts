import * as functions from 'firebase-functions';
import StoryServiceFactory from "./StoryServiceFactory";
import ArticleServiceFactory from "./ArticleServiceFactory";

const express = require('express');


const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

app.get('/story', (req, res) => {
    StoryServiceFactory.get('vi').getStories(req.query.pageNumber, req.query.category).then(stories => res.send(stories))
});


app.get('/article', (req, res) => {
    ArticleServiceFactory.get("vi").getArticleById(req.query.url).then(article => res.send(article))
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

exports.app = functions.https.onRequest(app);

