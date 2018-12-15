import Article from "../../../model/Article";
import {ArticleService} from "../ArticleService";
import GoogleArticleParser from "./GoogleArticleParser";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');

export default class GoogleArticleService extends ArticleService {

    constructor() {
        super();
        this.parser = new GoogleArticleParser();
    }

    crawnArticleById(id: string): Promise<Article> {
        return new Promise((resolve) => {
                axios.get("https://m.baomoi.com" + id).then(response => {
                    const dom = new JSDOM(response.data);
                    resolve(this.parser.setHtml(dom.window.document.getElementsByTagName('body')[0]).parserArticle())

                })
            }
        )


    }
}