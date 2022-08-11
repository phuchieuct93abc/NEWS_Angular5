import { Story } from '../../../../model/Story';
import BaomoiStoryParser from './BaomoiStoryParser';
import { CONFIG } from '../../const';
import { StoryService } from '../StoryService';
import CategoryHelper from '../../../../model/Categories';
import Categories from '../../../../model/Categories';
import { createHmac } from 'crypto';
import BaomoiArticleService from '../../article/baomoi/BaomoiArticleService';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const baomoiStoryparams =
  'https://baomoi.com/api/v1/content/get/list-by-type?listType=3&listId={categoryId}&page={page}&ctime={ctime}&version=0.1.30&sig={sig}&apiKey=kI44ARvPwaqL7v0KuDSM0rGORtdY1nnw';

export default class BaomoiStoryService extends StoryService {
  queryStories(response): { payload?: any; story: any[] } {
    return { story: response.data.data.items };
  }

  constructor(protected url: string, category: string) {
    super(url, new BaomoiStoryParser(), category, new BaomoiArticleService(category));
  }

  static createInstance(pageNumber: string, category: string) {
    const ctime = Math.floor(new Date().getTime() / 1000) + '';
    const categoryId = CategoryHelper.getCategory(category).id + '';
    const baseParamSign = `/api/v1/content/get/list-by-typectime=${ctime}listId=${categoryId}listType=3page=${pageNumber}version=0.1.30`;
    const sig = createHmac('sha256', '882QcNXV4tUZbvAsjmFOHqNC1LpcBRKW').update(baseParamSign).digest('hex');
    let url = baomoiStoryparams.replace('{page}', pageNumber).replace('{categoryId}', categoryId).replace('{sig}', sig).replace('{ctime}', ctime);
    return new BaomoiStoryService(url, category);
  }

}
