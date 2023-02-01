import { AxiosInstance } from 'axios';
import Article from '../../../model/Article';
import { Story } from '../../../model/Story';
import { ArticleService } from '../article/ArticleService';
import NotificationService from '../notification/notification.service';
import { StoryParser } from './StoryParser';

const axios: AxiosInstance = require('axios');

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

  public async getStories(): Promise<{ payload: any; story: Story[] }> {
    try {
      const response = await this.getResponse();
      const { story, payload } = this.queryStories(response);
      let stories = Array.from(story)
        .map((r) => this.storyParser.setData(r).parseStory())
        .filter((r) => r != null);
      return { story: this.uniqueBy(stories), payload };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  protected async getResponse(): Promise<any> {
    const url = await this.getUrl();
    return axios.get(url).catch((response) => {
      console.error(response);
    });
  }

  public async cache(): Promise<any> {
    const stories = (await this.getStories()).story;
    return this.cacheArticles(stories);
  }

  private async cacheArticles(stories: Story[]): Promise<any> {
    let cachedArticles: Article[] = await Promise.all(
      stories.map(async (story) => {
        try {
          return await this.articleService.crawArticleByIdAndSaveArticle(story.id);
        } catch (error) {
          console.error(error);
          return Promise.resolve(null);
        }
      })
    );
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

  abstract queryStories(data: any): { payload?: any; story: any[] };
}
