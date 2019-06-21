import {ArticleService} from "./ArticleService";
import GoogleArticleService from "./google-news/GoogleArticleService";
import BaomoiArticleService from "./baomoi/BaomoiArticleService";
import CategoryHelper from "../../../model/Categories";
import TinhteArticleService from "./tinhte/TinhteArticleService";

export default class ArticleServiceFactory {
    public static get(req): ArticleService {
        let category = req.query.category;
        let englishCategory = CategoryHelper.englishCategories().find(cate => cate.name == category);


        if(category==="tinh-te"){
            return new TinhteArticleService();
        }
        if (englishCategory!==undefined) {

            return new GoogleArticleService();
        }
        return new BaomoiArticleService();
    }
}
