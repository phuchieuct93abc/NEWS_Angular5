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
      article.sourceUrl = articleObject.pageUrl;
      article.externalUrl = articleObject.resolvedPageUrl;
      article.id = this.articleId;
    article.time = new Date(articleObject.date).getTime();
    article.description = '';
    if (articleObject.images?.length > 0) {
      article.images = [articleObject.images[0].url];
    }
    return article;
  }
}
