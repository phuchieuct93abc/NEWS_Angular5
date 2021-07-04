import BaomoiStoryService from "./baomoi/BaomoiStoryService";
import { StoryService } from "./StoryService";
import CategoryHelper from "../../../model/Categories";
import TinhteStoryService from "./tinhte/TinhteStoryService";

export default class StoryServiceFactory {
    public static get(req): StoryService {

        let category = req.query.category;

        if (category == "tinh-te") {
            return TinhteStoryService.createInstance(req.query.pageNumber);
        }
        return BaomoiStoryService.createInstance(req.query.pageNumber, req.query.category);
    }
}
