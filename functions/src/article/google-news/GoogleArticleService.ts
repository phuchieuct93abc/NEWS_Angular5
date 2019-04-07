import GoogleArticleParser from "./GoogleArticleParser";
import {ArticleService} from "../ArticleService";
import Article from "../../../../model/Article";
import DiffbotService from "../../../utils/diffbot.service";
import FirebaseService from "../../FirebaseService";


export default class GoogleArticleService extends ArticleService {

    constructor() {
        super();
        this.parser = new GoogleArticleParser();
    }

    crawnArticleById(id: string): Promise<Article> {

        return new Promise((resolve) => {
                FirebaseService.findArticle(id).then(article => {

                    if (article.exists) {
                        console.log("google new from firebase")
                        resolve(<Article>article.data())
                    } else {
                        new DiffbotService(id).get().then(value => {
                            let result = value.objects.map(news => {

                                return new Article(news.pageUrl, news.title, null, news.html, null, null, null, news.pageUrl, news.siteName, [news.images[0].url], null);
                            });
                            console.log("google new from source")
                            FirebaseService.saveArticle(<Article>result[0]).then(() => {
                                resolve(result[0]);

                            })
                        })

                    }

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
