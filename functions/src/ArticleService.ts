import BaomoiArticleParser from "./parsers/baomoi/BaomoiArticleParser";
import Article from "../../model/Article";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');

export default class ArticleService {
    getArticleById(id): Promise<Article> {
        return new Promise((resolve) => {
                axios.get("https://m.baomoi.com" + id).then(response => {
                    const dom = new JSDOM(response.data);
                    resolve(new BaomoiArticleParser(dom.window.document.getElementsByTagName('body')[0]).article)

                })
            }
        )


    }
}