import BaomoiArticleParser from "./BaomoiArticleParser";
import { ArticleService } from "../ArticleService";
import Article from "../../../../model/Article";
import { createHmac } from "crypto";
import { BaomoiData } from "./BaoMoiArticleTypes";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');

export default class BaomoiArticleService extends ArticleService<BaomoiData> {

    readonly baomoiUrl = "https://baomoi.com/api/v1/content/get/detail?id={id}&ctime=1624286388&version=0.1.7&sig={sig}&apiKey=kI44ARvPwaqL7v0KuDSM0rGORtdY1nnw"
    constructor(category: string) {
        super();
        this.parser = new BaomoiArticleParser();
        this.category = category;;
    }

    async crawnArticleById(id: string): Promise<Article> {
        let url = this.baomoiUrl.replace("{id}", id);
        const baseParamSign = `/api/v1/content/get/detailctime=1624286388id=${id}version=0.1.7`;
        const sig = createHmac('sha256', '882QcNXV4tUZbvAsjmFOHqNC1LpcBRKW').update(baseParamSign).digest("hex");
        url = url.replace("{sig}", sig);
        const response = await axios.get(url);
        const article = this.parser.setData(response.data.data).parserArticle();
        article.category = this.category;
        return article;
    }

    async getComment(id: string): Promise<Comment[]> {
        const url = `https://data.baomoi.com/comment.aspx?contentid=${id}&size=100`;
        const response = await axios.get(url)

        return response.data.result as Comment[];

    }
}
