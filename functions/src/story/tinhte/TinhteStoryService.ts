import { Story } from '../../../../model/Story';
import TinhteArticleService from '../../article/tinhte/TinhteArticleService';
import { StoryService } from '../StoryService';

import TinhteStoryParser from './TinhteStoryParser';
const axios = require('axios');

export default class TinhteStoryService extends StoryService {
  public pageNumber: number;
  public static urlApi = 'https://tinhte.vn/appforo/index.php?threads/promoted&limit=30&page=${page}&oauth_token=${token}';

  constructor(protected url: string, protected category: string) {
    super(url, new TinhteStoryParser(), category, new TinhteArticleService());
  }

  queryStories(data: any): any[] {
    return data.data.threads;
  }

  search(pageNumber: string, keyword: string): Promise<Story[]> {
    return undefined;
  }

  public static async getOAuthToken(): Promise<string> {
    const index = await axios.get('https://tinhte.vn');
    const result = /oauth_token=([^"]*)"/gm.exec(index.data)[1];
    console.log(result);
    return result;
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
