import BaomoiArticleParser from "./BaomoiArticleParser";
import {ArticleService} from "../ArticleService";
import Article from "../../../../model/Article";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');

export default class BaomoiArticleService extends ArticleService {

    readonly baomoiUrl = "https://baomoi.com/api/v1/content/get/detail?id={id}&platform=2&ctime=1624286388&version=0.1.3&sig=f0701ed9609f9aba211324ac742da999510fc88ede040e0e2d556e85a452bcb2&apiKey=kI44ARvPwaqL7v0KuDSM0rGORtdY1nnw"
    constructor(category: string) {
        super();
        this.parser = new BaomoiArticleParser();
        this.category  = category;;
    }

    crawnArticleById(id: string): Promise<Article> {
        return new Promise((resolve) => {
            
                axios.get(this.baomoiUrl.replace("{id}",id)).then(response => {

                    const article = this.parser.setData(response.data.data).parserArticle();
                    article.category =  this.category;
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
