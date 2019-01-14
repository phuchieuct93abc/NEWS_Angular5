import BaomoiArticleParser from "./BaomoiArticleParser";
import {ArticleService} from "../ArticleService";
import Article from "../../../../model/Article";

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
                axios.get(`https://m.baomoi.com/a/c/${id}.epi`).then(response => {

                    const dom = new JSDOM(response.data);
                    const article = this.parser.setHtml(dom.window.document.getElementsByTagName('body')[0]).parserArticle();
                    resolve(article);

                })
            }
        )


    }

    getSource(id: string): Promise<string> {
        return new Promise(resolver => {

            axios.get(`https://m.baomoi.com/a/r/${id}.epi`).then(response => {
                const dom = new JSDOM(response.data);
                const message: HTMLScriptElement[] = dom.window.document.querySelectorAll('[type="text/javascript"]');
                var matches = message[0].textContent.match(/\bhttps?:\/\/[^"]+/gi);
                resolver(matches[0])

            })
        })
    }

    getComment(id: string): Promise<Comment[]> {
        return new Promise((resolve) => {
                const url = `https://data.baomoi.com/comment.aspx?contentid=${id}&size=100`;
                axios.get(url).then(response => {

                    let result = <Comment[]>response.data.result;

                    resolve(result)

                })
            }
        )
    }
}