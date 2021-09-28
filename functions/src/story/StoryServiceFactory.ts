import BaomoiStoryService from './baomoi/BaomoiStoryService';
import { StoryService } from './StoryService';
import TinhteStoryService from './tinhte/TinhteStoryService';

export default class StoryServiceFactory {
  public static get(req): StoryService {
    const { category, pageNumber } = req.query;
    if (category === 'tinh-te') {
      return TinhteStoryService.createInstance(pageNumber);
    }
    return BaomoiStoryService.createInstance(pageNumber, category);
  }
}
