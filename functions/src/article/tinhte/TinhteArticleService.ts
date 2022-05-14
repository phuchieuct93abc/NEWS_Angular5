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
    this.parser = new TinhteArticleParser();
    this.category = 'tinh-te';
  }

  async crawnArticleById(id: string): Promise<Article> {
    const token = await TinhteStoryService.getOAuthToken();
    const response = await axios.get(this.tinhteArticleUrl.replace('${id}', id).replace('${token}', token));
    const article = this.parser.setData(response.data['thread']).parserArticle();
    article.category = this.category;
    return article;
  }

  async getComment(id: string): Promise<Comment[]> {
    return [];
  }
}
