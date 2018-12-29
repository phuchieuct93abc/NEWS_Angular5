import {ArticleService} from "./ArticleService";
import GoogleArticleService from "./google-news/GoogleArticleService";
import BaomoiArticleService from "./baomoi/BaomoiArticleService";

export default class ArticleServiceFactory {
    public static get(lang: string): ArticleService {
        if (lang === 'en') {
            return new GoogleArticleService();
        }
        return new BaomoiArticleService();
    }
}