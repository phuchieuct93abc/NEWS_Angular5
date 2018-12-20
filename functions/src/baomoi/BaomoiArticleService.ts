import BaomoiArticleParser from "./BaomoiArticleParser";
import Article from "../../../model/Article";
import {ArticleService} from "../ArticleService";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');

export default class BaomoiArticleService extends ArticleService {

    constructor() {
        super();
        this.parser = new BaomoiArticleParser();
    }

    crawnArticleById(id: string): Promise<Article> {
        return new Promise((resolve) => {
            console.time(`fetch article${id}`);
                axios.get("https://m.baomoi.com" + id).then(response => {
                    const dom = new JSDOM(response.data);
                    const article = this.parser.setHtml(dom.window.document.getElementsByTagName('body')[0]).parserArticle();
                    console.timeEnd(`fetch article${id}`);
                    resolve(article);

                })
            }
        )


    }
}