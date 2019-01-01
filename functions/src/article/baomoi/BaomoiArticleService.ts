import BaomoiArticleParser from "./BaomoiArticleParser";
import {ArticleService} from "../ArticleService";
import Article from "../../../../model/Article";
import Utility from "../../Utility";

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

    getSource(url: string): Promise<string> {
        return new Promise(resolver => {

            const redirectUrl = Utility.replaceAll(url, '/c/', '/r/');
            axios.get("https://m.baomoi.com" + redirectUrl).then(response => {
                const dom = new JSDOM(response.data);
                const message: HTMLScriptElement[] = dom.window.document.querySelectorAll('[type="text/javascript"]');
                var matches = message[0].textContent.match(/\bhttps?:\/\/[^"]+/gi);
                resolver(matches[0])

            })
        })
    }
}