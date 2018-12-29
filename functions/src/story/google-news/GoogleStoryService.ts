import { Story } from "../../../model/Story";
import { StoryService } from "../story/StoryService";
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
  private APIKEY = "";

  constructor() {
    super();
    this.storyParser = new GoogleStoryParser();
  }

  getStories(pageNumber: string, category: string): Promise<Story[]> {
    return new Promise(resolve => {
      newsapi.v2
        .topHeadlines({
          category: "technology",
          language: "en",
          country: "us"
        })
        .then(response => {
          const data: GoogleArticle[] = response.articles;
          resolve(data.map(d => this.storyParser.setRawData(d).parseStory()));
        });
    });
  }
}
