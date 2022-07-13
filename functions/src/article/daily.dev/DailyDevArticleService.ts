import Article from '../../../../model/Article';
import { ArticleService } from '../ArticleService';

export class DailyDevArticleService extends ArticleService<any> {
  crawArticleById(id: string): Promise<Article> {
    return Promise.resolve(null);
  }
  getComment(id: string): Promise<Comment[]> {
    throw new Error('Method not implemented.');
  }
}
