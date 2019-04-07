import BaomoiStoryService from "./baomoi/BaomoiStoryService";
import GoogleStoryService from "./google-news/GoogleStoryService";
import {StoryService} from "./StoryService";
import CategoryHelper from "../../../model/Categories";

export default class StoryServiceFactory {
    public static get(req): StoryService {

        let category = req.query.category;
        let englishCategory = CategoryHelper.englishCategories().find(cate => cate.name == category);

        if (englishCategory!==undefined) {

            return GoogleStoryService.createInstance(req.query.pageNumber, req.query.category);
        } else {
            return BaomoiStoryService.createInstance(req.query.pageNumber, req.query.category);
        }
        return null
    }
}
