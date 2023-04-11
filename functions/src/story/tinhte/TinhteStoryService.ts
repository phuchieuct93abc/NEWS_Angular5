import { AxiosInstance } from 'axios';
import { Story } from '../../../../model/Story';
import TinhteArticleService from '../../article/tinhte/TinhteArticleService';
import { StoryService } from '../StoryService';

import TinhteStoryParser from './TinhteStoryParser';
const axios: AxiosInstance = require('axios');
let lastTokenTime = new Date();
let lastToken = null;

export default class TinhteStoryService extends StoryService {
  public pageNumber: number;
  public static urlApi = 'https://tinhte.vn/appforo/index.php?threads/promoted&limit=30&page=${page}&oauth_token=${token}';

  public static readonly oauthRegex = /(?<=oauth_token=).*?zolu/gm;

  constructor(protected url: string, protected category: string) {
    super(url, new TinhteStoryParser(), category, new TinhteArticleService());
  }

  queryStories(data: any): { payload?: any; story: any[] } {
    return { story: data.data.threads };
  }

  public static async getOAuthToken(): Promise<string> {
    try {
      if (lastToken == null || lastTokenTime.getTime() + 5 * 60 * 1000 < new Date().getTime()) {
        const index = await axios.get('https://tinhte.vn', { timeout: 60000 });
        lastToken = TinhteStoryService.oauthRegex.exec(index.data)[0];
        lastTokenTime = new Date();
      }
      return lastToken;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static createInstance(pageNumber: number) {
    let tinhteUri = TinhteStoryService.urlApi.replace('${page}', pageNumber + '');
    const tinhteStoryService = new TinhteStoryService(tinhteUri, 'tinh-te');
    tinhteStoryService.pageNumber = pageNumber;
    return tinhteStoryService;
  }

  protected async getUrl(): Promise<string> {
    const token = await TinhteStoryService.getOAuthToken();
    return this.url.replace('${token}', token);
  }
}
