import { ArticleService } from "../ArticleService";
import Article from "../../../../model/Article";
import TinhteArticleParser from "./TinhteArticleParser";
import { TinhteData } from "./TInhTeArticleType";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');

export default class TinhteArticleService extends ArticleService<TinhteData> {

    private tinhteArticleUrl = "https://tinhte.vn/appforo/index.php?/threads/${id}&oauth_token=qcunuxxyhhbt5ifhj80g6liz44thgdz7"

    constructor() {
        super();
        this.parser = new TinhteArticleParser();
        this.category = 'tinh-te'
    }

    async crawnArticleById(id: string): Promise<Article> {
        const response = await axios.get(this.tinhteArticleUrl.replace("${id}", id))
        const article = this.parser.setData(response.data["thread"]).parserArticle();
        article.category = this.category;
        return article;
    }

    async getComment(id: string): Promise<Comment[]> {
        return []

    }
}
