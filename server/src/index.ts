import StoryParser from "./parsers/StoryParser";
import Article from "./model/Article";
import ArticleParser from "./parsers/ArticleParser";

const express = require('express')
const axios = require('axios');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const app = express()
const port = 3000;
var cors = require('cors')

app.use(cors())

app.get('/', (req, res) => {
    axios.get("https://m.baomoi.com/").then(response => {
        const dom = new JSDOM(response.data);
        const result: HTMLCollection = dom.window.document.getElementsByClassName("story");
        let stories = Array.from(result).map(r => {
            return new StoryParser(r).story;
        }).filter(r => r !== null);
        res.send(stories)
    })
})


app.get('/story', (req, res) => {
    axios.get("https://m.baomoi.com/"+req.query.url).then(response => {
        const dom = new JSDOM(response.data);
        res.send(new ArticleParser(dom.window.document.getElementsByTagName('body')[0]).getArticle())
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))