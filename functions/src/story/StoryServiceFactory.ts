import BaomoiStoryService from './baomoi/BaomoiStoryService';
import DailyDevStoryService from './daily.dev/DailyDevStoryService';
import { StoryService } from './StoryService';
import TinhteStoryService from './tinhte/TinhteStoryService';

export default class StoryServiceFactory {
  public static get(req): StoryService {
    const { category, pageNumber, currentCursor } = req.query;
    if (category === 'tinh-te') {
      return TinhteStoryService.createInstance(pageNumber);
    }
    if (category === 'daily.dev') {
      return new DailyDevStoryService(currentCursor);
    }
    return BaomoiStoryService.createInstance(pageNumber, category);
  }
}
