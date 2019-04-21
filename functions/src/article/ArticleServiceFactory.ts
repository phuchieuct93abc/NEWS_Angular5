import {ArticleService} from "./ArticleService";
import GoogleArticleService from "./google-news/GoogleArticleService";
import BaomoiArticleService from "./baomoi/BaomoiArticleService";
import CategoryHelper from "../../../model/Categories";

export default class ArticleServiceFactory {
    public static get(req): ArticleService {
        let category = req.query.category;
        let englishCategory = CategoryHelper.englishCategories().find(cate => cate.name == category);

        console.log(category,englishCategory)
        if (englishCategory!==undefined) {

            return new GoogleArticleService();
        }
        return new BaomoiArticleService();
    }
}
