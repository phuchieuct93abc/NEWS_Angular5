import { ArticleService } from './ArticleService';
import BaomoiArticleService from './baomoi/BaomoiArticleService';
import CategoryHelper from '../../../model/Categories';
import TinhteArticleService from './tinhte/TinhteArticleService';
import DailyDevStoryService from '../story/daily.dev/DailyDevStoryService';
import { DailyDevArticleService } from './daily.dev/DailyDevArticleService';

export default class ArticleServiceFactory {
  public static get(category: string): ArticleService<any> {
    if (category === 'tinh-te') {
      return new TinhteArticleService();
    }
    if (category === 'daily.dev') {
      return new DailyDevArticleService();
    }
    return new BaomoiArticleService(category);
  }
}
