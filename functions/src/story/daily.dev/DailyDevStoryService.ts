import { Story } from '../../../../model/Story';
import { DailyDevArticleService } from '../../article/daily.dev/DailyDevArticleService';
import { StoryService } from '../StoryService';
import DailyDevStoryParser from './DailyDevStoryParser';
import { DailyDevStory } from './DailyDevType';

const axios = require('axios');

const url = 'https://app.daily.dev/api/graphql';
const query = {
  query:
    '\n  query AnonymousFeed(\n    $loggedIn: Boolean! = false\n    $first: Int\n    $after: String\n    $ranking: Ranking\n    $version: Int\n  ) {\n    page: anonymousFeed(\n      first: $first\n      after: $after\n      ranking: $ranking\n      version: $version\n    ) {\n      ...FeedPostConnection\n    }\n  }\n  \n  fragment FeedPostConnection on PostConnection {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      node {\n        ...FeedPost\n        ...UserPost @include(if: $loggedIn)\n      }\n    }\n  }\n  \n  fragment FeedPost on Post {\n    id\n    title\n    createdAt\n    image\n    readTime\n    source {\n      id\n      name\n      image\n    }\n    permalink\n    numComments\n    numUpvotes\n    commentsPermalink\n    scout {\n      id\n      name\n      image\n      username\n    }\n    author {\n      id\n      name\n      image\n      username\n      permalink\n    }\n    trending\n    tags\n  }\n\n  \n  fragment UserPost on Post {\n    read\n    upvoted\n    commented\n    bookmarked\n  }\n\n\n',
  variables: { version: 7, ranking: 'POPULARITY', first: 13, loggedIn: false, unreadOnly: false },
};

export default class DailyDevStoryService extends StoryService {
  constructor(private nextCursor: string) {
    super('https://app.daily.dev/api/graphql', new DailyDevStoryParser(), null, new DailyDevArticleService());
  }
  queryStories(data: any): { payload?: any; story: any[] } {
    return { story: data, payload: { nextCursor: this.nextCursor } };
  }
  search(pageNumber: string, keyword: string): Promise<Story[]> {
    throw new Error('Method not implemented.');
  }
  protected async getResponse() {
    const requestQuery = { ...query };
    if (this.nextCursor) {
      (requestQuery.variables as any).after = this.nextCursor;
    }
    const response = await axios({
      url,
      method: 'post',
      data: requestQuery,
    });
    const data = response.data as DailyDevStory;
    this.nextCursor = data.data.page.pageInfo.endCursor;
    return data.data.page.edges;
  }
}
