import Article from '../../../model/Article';
import { ArticleParser } from './ArticleParser';
import FirebaseService from '../FirebaseService';

export abstract class ArticleService<T> {
  protected category: string;
  protected parser: ArticleParser<T>;

  abstract crawArticleById(id: string): Promise<Article>;

  abstract getComment(id: string): Promise<Comment[]>;

  public async getArticleById(id: string): Promise<Article> {
    const firebaseArticle = await FirebaseService.findArticle(id, this.category);
    if (firebaseArticle?.exists) {
      const cachedArticle = Object.assign(new Article(), firebaseArticle.data());
      return this.transformCachedArticle(cachedArticle);
    }
    return this.crawArticleById(id);
  }

  protected transformCachedArticle(firebaseArticle: Article): Article {
    return firebaseArticle;
  }

  public async crawArticleByIdAndSaveArticle(articleId: string): Promise<Article> {
    const firebaseArticle = await FirebaseService.findArticle(articleId, this.category);
    if (firebaseArticle?.exists) {
      return null;
    }

    const article = await this.crawArticleById(articleId);
    await FirebaseService.saveArticle(article, this.category);
    return article;
  }
}
