import BaomoiStoryService from "./baomoi/BaomoiStoryService";
import GoogleStoryService from "./google-news/GoogleStoryService";

export default class StoryServiceFactory {
    public static get(lang = 'vi'): any {
        if (lang === 'en') {

            return new GoogleStoryService();
        } else {
            return new BaomoiStoryService();
        }
        return null
    }
}