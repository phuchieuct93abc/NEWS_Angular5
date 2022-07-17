import BaomoiStoryService from './baomoi/BaomoiStoryService';
import DailyDevStoryService from './daily.dev/DailyDevStoryService';
import { StoryService } from './StoryService';
import TinhteStoryService from './tinhte/TinhteStoryService';

export default class StoryServiceFactory {
  public static get(req): StoryService {
    const { category, pageNumber, payload } = req.query;
    if (category === 'tinh-te') {
      return TinhteStoryService.createInstance(pageNumber);
    }
    if (category === 'daily.dev') {
      let nextCursor = null;
      if (payload) {
        try {
          nextCursor = JSON.parse(payload)?.nextCursor;
        } catch (error) {
          console.log('Get first page daily.dev with no current cursor');
        }
      }
      return new DailyDevStoryService(nextCursor);
    }
    return BaomoiStoryService.createInstance(pageNumber, category);
  }
}
