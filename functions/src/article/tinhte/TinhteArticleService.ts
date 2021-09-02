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
        this.category = 'tinh-te'
    }

    crawnArticleById(id: string): Promise<Article> {
        return new Promise((resolve) => {
                axios.get(this.tinhteArticleUrl.replace("${id}", id)).then(response => {
                    const article = this.parser.setData(response.data["thread"]).parserArticle();
                    article.category = this.category;
                    resolve(article);

                })
            }
        )


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
