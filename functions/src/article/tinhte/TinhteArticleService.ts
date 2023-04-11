import { ArticleService } from '../ArticleService';
import Article from '../../../../model/Article';
import TinhteArticleParser from './TinhteArticleParser';
import { TinhteData } from './TInhTeArticleType';
import TinhteStoryService from '../../story/tinhte/TinhteStoryService';
import { AxiosInstance } from 'axios';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios: AxiosInstance = require('axios');

export default class TinhteArticleService extends ArticleService<TinhteData> {
  private tinhteArticleUrl = 'https://tinhte.vn/appforo/index.php?/threads/${id}&oauth_token=${token}';

  constructor() {
    super();
    this.category = 'tinh-te';
  }

  async crawArticleById(id: string): Promise<Article> {
    try {
      const token = await TinhteStoryService.getOAuthToken();
      const response = await axios.get(this.tinhteArticleUrl.replace('${id}', id).replace('${token}', token), { timeout: 60000 });
      console.error(response);
      const article = new TinhteArticleParser().setData(response.data['thread']).parserArticle();
      article.category = this.category;
      return article;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  protected async transformCachedArticle(firebaseArticle: Article): Promise<Article> {
    let articleText = JSON.stringify(firebaseArticle);
    articleText = articleText.replace(TinhteStoryService.oauthRegex, await TinhteStoryService.getOAuthToken());
    const article = JSON.parse(articleText);
    return Object.assign(new Article(), article);
  }
}
