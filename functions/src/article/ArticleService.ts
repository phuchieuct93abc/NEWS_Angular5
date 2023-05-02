import Article from '@model/Article';
import FirebaseService from '../FirebaseService';

export abstract class ArticleService<T> {
  protected category: string;

  abstract crawArticleById(id: string): Promise<Article>;

  public async getArticleById(id: string): Promise<Article> {
    const firebaseArticle = await FirebaseService.findArticle(id, this.category);
    if (firebaseArticle?.exists) {
      const cachedArticle = Object.assign(new Article(), firebaseArticle.data());
      return this.transformCachedArticle(cachedArticle);
    }
    return this.crawArticleById(id);
  }

  protected async transformCachedArticle(firebaseArticle: Article): Promise<Article> {
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
