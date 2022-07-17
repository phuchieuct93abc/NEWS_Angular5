import { Story } from '../../../../model/Story';
import { DailyDevArticleService } from '../../article/daily.dev/DailyDevArticleService';
import { StoryService } from '../StoryService';
import DailyDevStoryParser from './DailyDevStoryParser';

const axios = require('axios');

const url = 'https://app.daily.dev/api/graphql';
const query = {
  query:
    '\n  query MostUpvotedFeed(\n    $loggedIn: Boolean! = false\n    $first: Int\n    $after: String\n    $period: Int\n  ) {\n    page: mostUpvotedFeed(first: $first, after: $after, period: $period) {\n      ...FeedPostConnection\n    }\n  }\n  \n  fragment FeedPostConnection on PostConnection {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      node {\n        ...FeedPost\n        ...UserPost @include(if: $loggedIn)\n      }\n    }\n  }\n  \n  fragment FeedPost on Post {\n    id\n    title\n    createdAt\n    image\n    readTime\n    source {\n      id\n      name\n      image\n    }\n    permalink\n    numComments\n    numUpvotes\n    commentsPermalink\n    scout {\n      id\n      name\n      image\n      username\n    }\n    author {\n      id\n      name\n      image\n      username\n      permalink\n    }\n    trending\n    tags\n  }\n\n  \n  fragment UserPost on Post {\n    read\n    upvoted\n    commented\n    bookmarked\n  }\n\n\n',
  variables: { version: 7, period: 7, first: 13, loggedIn: false, unreadOnly: false },
};

export default class DailyDevStoryService extends StoryService {
  constructor(private currentCursor: string) {
    super('https://app.daily.dev/api/graphql', new DailyDevStoryParser(), null, new DailyDevArticleService());
  }
  queryStories(data: any): any[] {
    return data;
  }
  search(pageNumber: string, keyword: string): Promise<Story[]> {
    throw new Error('Method not implemented.');
  }
  protected async getResponse() {
    const response = await axios({
      url,
      method: 'post',
      data: query,
    });
    return response.data.data.page.edges;
  }
}
