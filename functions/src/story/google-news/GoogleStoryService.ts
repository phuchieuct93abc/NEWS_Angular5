import { Story } from "../../../../model/Story";
import { StoryService } from "../StoryService";
import GoogleStoryParser from "./GoogleStoryParser";
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("e60f99befdf44b02b7472b0cc82cb7d4");

export interface GoogleArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export default class GoogleStoryService extends StoryService {
  queryStories(dom: Document): HTMLCollection {
    return undefined;
  }

  search(pageNumber: string, keyword: string): Promise<Story[]> {
    return undefined;
  }

}
