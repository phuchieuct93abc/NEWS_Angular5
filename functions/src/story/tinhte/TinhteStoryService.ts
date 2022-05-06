import { Story } from '../../../../model/Story';
import TinhteArticleService from '../../article/tinhte/TinhteArticleService';
import { StoryService } from '../StoryService';

import TinhteStoryParser from './TinhteStoryParser';

export default class TinhteStoryService extends StoryService {
  public pageNumber: number;
  public static urlApi =
    'https://tinhte.vn/appforo/index.php?threads/promoted&limit=30&page=${page}&oauth_token=0,1651845560,0d8d23e8b2d12d722c36d0fc9b354b48,lxi7g2zolu';

  constructor(protected url: string, protected category: string) {
    super(url, new TinhteStoryParser(), category, new TinhteArticleService());
  }

  queryStories(data: any): any[] {
    return data.data.threads;
  }

  search(pageNumber: string, keyword: string): Promise<Story[]> {
    return undefined;
  }

  static createInstance(pageNumber: number) {
    let tinhteUri = TinhteStoryService.urlApi.replace('${page}', pageNumber + '');
    const tinhteStoryService = new TinhteStoryService(tinhteUri, 'tinh-te');
    tinhteStoryService.pageNumber = pageNumber;
    return tinhteStoryService;
  }
}
