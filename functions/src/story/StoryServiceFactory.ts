import BaomoiStoryService from "./baomoi/BaomoiStoryService";
import GoogleStoryService from "./google-news/GoogleStoryService";
import {StoryService} from "./StoryService";

export default class StoryServiceFactory {
    public static get(req): StoryService {
        if (req.query.lang === 'en') {

            return new GoogleStoryService(req.query.pageNumber,req.query.category);
        } else {
            return  BaomoiStoryService.createInstance(req.query.pageNumber,req.query.category);
        }
        return null
    }
}
