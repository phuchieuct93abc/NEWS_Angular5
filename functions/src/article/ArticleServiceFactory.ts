import {ArticleService} from "./ArticleService";
import BaomoiArticleService from "./baomoi/BaomoiArticleService";
import CategoryHelper from "../../../model/Categories";
import TinhteArticleService from "./tinhte/TinhteArticleService";

export default class ArticleServiceFactory {
    public static get(category: string): ArticleService {
        if(category==="tinh-te"){
            return new TinhteArticleService();
        }
        return new BaomoiArticleService(category);
    }
}
