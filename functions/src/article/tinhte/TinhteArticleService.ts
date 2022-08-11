import { ArticleService } from '../ArticleService';
import Article from '../../../../model/Article';
import TinhteArticleParser from './TinhteArticleParser';
import { TinhteData } from './TInhTeArticleType';
import TinhteStoryService from '../../story/tinhte/TinhteStoryService';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');

export default class TinhteArticleService extends ArticleService<TinhteData> {
  private tinhteArticleUrl = 'https://tinhte.vn/appforo/index.php?/threads/${id}&oauth_token=${token}';

  constructor() {
    super();
    this.category = 'tinh-te';
  }

  async crawArticleById(id: string): Promise<Article> {
    const token = await TinhteStoryService.getOAuthToken();
    const response = await axios.get(this.tinhteArticleUrl.replace('${id}', id).replace('${token}', token));
    const article = new TinhteArticleParser().setData(response.data['thread']).parserArticle();
    article.category = this.category;
    return article;
  }


  protected async transformCachedArticle(firebaseArticle: Article): Promise<Article> {
    let articleText = JSON.stringify(firebaseArticle);
    articleText = articleText.replace(TinhteStoryService.oauthRegex, await TinhteStoryService.getOAuthToken());
    const article = JSON.parse(articleText);
    return Object.assign(new Article(), article);
  }
}
