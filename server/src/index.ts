import StoryService from "./StoryService";
import ArticleService from "./ArticleService";

const express = require('express');


const app = express();
const port = 3000;
var cors = require('cors');
const storyService = new StoryService();
const articleService = new ArticleService();
app.use(cors());

app.get('/story', (req, res) => {
    console.log(req.query.pageNumber);
    storyService.getStories(req.query.pageNumber, req.query.category).then(stories => res.send(stories))
});


app.get('/article', (req, res) => {
    articleService.getArticleById(req.query.url).then(article => res.send(article))
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));