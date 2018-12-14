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

    getArticleById(id: string): Promise<Article> {
        console.log("AA");
        return new Promise((resolve) => {
                axios.get("https://m.baomoi.com" + id).then(response => {
                    const dom = new JSDOM(response.data);
                    resolve(this.parser.setHtml(dom.window.document.getElementsByTagName('body')[0]).parserArticle())

                })
            }
        )


    }
}