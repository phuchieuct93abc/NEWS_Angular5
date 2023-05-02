import Article from '@model/Article';
import { ArticleService } from '../ArticleService';
import { Diffbot } from 'diffbot';
import DailyDevArticleParser from './DailyDevArticleParser';
import FirebaseService from '../../FirebaseService';
export class DailyDevArticleService extends ArticleService<any> {
  constructor() {
    super();
    this.category = 'daily.dev';
  }
  async crawArticleById(id: string): Promise<Article> {
    return new Promise(async (resolve) => {
      const diffbot = new Diffbot(await FirebaseService.getDiffBotCredential());
      diffbot.article(
        {
          url: 'https://api.daily.dev/r/' + id,
        },
        (_, response) => {
          resolve(new DailyDevArticleParser(id).setData(response).parserArticle());
        }
      );
    });
  }
}
