import Article from '../../../model/Article';
import { Story } from '../../../model/Story';
import { ArticleService } from '../article/ArticleService';
import NotificationService from '../notification/notification.service';
import { StoryParser } from './StoryParser';

const axios = require('axios');

export abstract class StoryService {
  readonly MAX_CACHE_NUMBER = 50;
  readonly MIN_RELATED_NOTIFY = 500;
  readonly MIN_LIKE_NOTIFY = 20;

  protected constructor(
    protected url: string,
    protected storyParser: StoryParser,
    protected category: string,
    protected articleService: ArticleService<any>
  ) {}

  protected async getUrl(): Promise<string> {
    return this.url;
  }

  public async getStories(): Promise<Story[]> {
    try {
      const url = await this.getUrl();
      const response = await axios.get(url).catch();
      const result = this.queryStories(response);
      let stories = Array.from(result)
        .map((r) => this.storyParser.setData(r).parseStory())
        .filter((r) => r != null);
      return this.uniqueBy(stories);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async cache(): Promise<any> {
    const stories = await this.getStories();
    return this.cacheArticles(stories);
  }

  private async cacheArticles(stories): Promise<any> {
    let cachedArticles: Article[] = await Promise.all(stories.map(async (story) => this.articleService.crawArticleByIdAndSaveArticle(story.id)));
    cachedArticles = cachedArticles.filter((article) => article != null);
    await this.sendNotification(cachedArticles);
    return cachedArticles.map((article) => ({ title: article.header, related: article.related }));
  }

  private async sendNotification(cachedArticle: Article[]) {
    let mostLikedArticles = cachedArticle.reduce((mostLiked: Article, current: Article) => {
      return mostLiked == undefined || current.likes > mostLiked.likes ? current : mostLiked;
    }, null);

    if (mostLikedArticles && mostLikedArticles.likes > this.MIN_LIKE_NOTIFY) {
      let notificationService = new NotificationService();
      await notificationService.send(mostLikedArticles, this.category);
    }
  }

  protected uniqueBy(stories): Story[] {
    const result = [];
    stories.forEach((story) => {
      if (!result.some((x) => x.id === story.id)) {
        result.push(story);
      }
    });
    return result;
  }

  abstract queryStories(data: any): any[];

  abstract search(pageNumber: string, keyword: string): Promise<Story[]>;
}
