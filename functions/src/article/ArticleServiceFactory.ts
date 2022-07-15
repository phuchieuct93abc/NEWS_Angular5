import { ArticleService } from './ArticleService';
import BaomoiArticleService from './baomoi/BaomoiArticleService';
import { DailyDevArticleService } from './daily.dev/DailyDevArticleService';
import TinhteArticleService from './tinhte/TinhteArticleService';

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
