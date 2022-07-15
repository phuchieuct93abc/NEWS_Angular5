import Article from '../../../../model/Article';
import { ArticleParser } from '../ArticleParser';
import { DailyDevArticleType } from './DailyDevArticleType';

export default class DailyDevArticleParser extends ArticleParser<DailyDevArticleType> {
  constructor(private articleId: string) {
    super();
  }
  parserArticle(): Article {
    const article = new Article();
    const [articleObject] = this.data.objects;
    article.body = articleObject.html;
    article.category = 'daily.dev';
    article.header = articleObject.title;
    article.externalUrl = articleObject.pageUrl;
    article.id = this.articleId;
    return article;
  }
}
