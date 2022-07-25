import Article from '../../../../model/Article';
import { ArticleService } from '../ArticleService';
import { Diffbot } from 'diffbot';
import DailyDevArticleParser from './DailyDevArticleParser';
export class DailyDevArticleService extends ArticleService<any> {
  constructor() {
    super();
    this.category = 'daily.dev';
  }
  crawArticleById(id: string): Promise<Article> {
    this.parser = new DailyDevArticleParser(id);

    return new Promise((resolve) => {
      const diffbot = new Diffbot('91ffd6d42adc4e0b04c8b5279c10e44c');
      diffbot.article(
        {
          url: 'https://api.daily.dev/r/' + id,
        },
        (error, response) => {
          resolve(this.parser.setData(response).parserArticle());
        }
      );
    });
  }
  getComment(id: string): Promise<Comment[]> {
    throw new Error('Method not implemented.');
  }
}
