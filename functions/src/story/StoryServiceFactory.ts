import BaomoiStoryService from "./baomoi/BaomoiStoryService";
import GoogleStoryService from "./google-news/GoogleStoryService";
import {StoryService} from "./StoryService";

export default class StoryServiceFactory {
    public static get(lang = 'vi'): StoryService {
        if (lang === 'en') {

            return new GoogleStoryService();
        } else {
            return new BaomoiStoryService();
        }
        return null
    }
}