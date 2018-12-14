import BaomoiStoryService from "./baomoi/BaomoiStoryService";
import GoogleStoryService from "./google-news/GoogleStoryService";

export default class StoryServiceFactory {
    public static get(lang: string): any {
        if (lang === 'en') {

            return new BaomoiStoryService();
        } else {
            return new GoogleStoryService();
        }
        return null
    }
}