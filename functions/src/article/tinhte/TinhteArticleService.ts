import {ArticleService} from "../ArticleService";
import Article from "../../../../model/Article";
import TinhteArticleParser from "./TinhteArticleParser";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');

export default class TinhteArticleService extends ArticleService {

    private tinhteArticleUrl = "https://tinhte.vn/appforo/index.php?/threads/${id}&oauth_token=qcunuxxyhhbt5ifhj80g6liz44thgdz7"

    constructor() {
        super();
        this.parser = new TinhteArticleParser();
    }

    crawnArticleById(id: string): Promise<Article> {
        return new Promise((resolve) => {
                axios.get(this.tinhteArticleUrl.replace("${id}", id)).then(response => {

                    console.log(response)
                    const article = this.parser.setData(response.data["thread"]).parserArticle();
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
