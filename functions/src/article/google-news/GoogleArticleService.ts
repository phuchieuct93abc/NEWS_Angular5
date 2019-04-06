import GoogleArticleParser from "./GoogleArticleParser";
import {ArticleService} from "../ArticleService";
import Article from "../../../../model/Article";
import DiffbotService from "../../../utils/diffbot.service";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');

export default class GoogleArticleService extends ArticleService {

    constructor() {
        super();
        this.parser = new GoogleArticleParser();
    }

    crawnArticleById(id: string): Promise<Article> {
        console.log("id", id);

        return new Promise((resolve) => {
                new DiffbotService(id).get().then(value => {
                    let result = value.objects.map(news => {

                        return new Article(news.pageUrl, news.title, null, news.html, null, null, null, news.pageUrl, news.siteName,[ news.images[0].url], null);
                    })
                    console.log(result)
                    resolve(result[0]);


                })

            }
        )


    }

    getSource(url: string): Promise<string> {
        return new Promise(resolver => {
            resolver(url)
        })
    }

    getComment(id: string): Promise<Comment[]> {
        return undefined;
    }
}
