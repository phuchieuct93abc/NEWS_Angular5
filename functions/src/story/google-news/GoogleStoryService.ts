import {Story} from "../../../../model/Story";
import {StoryService} from "../StoryService";
import GoogleStoryParser from "./GoogleStoryParser";

import axios from 'axios';
import {NEWS} from "./NEWS";
import StoryImage from "../../../../model/StoryImage";
import StoryMeta from "../../../../model/StoryMeta";


export default class GoogleStoryService extends StoryService {
    constructor(protected url: string) {
        super(url, new GoogleStoryParser())
    }

    queryStories(dom: Document): HTMLCollection {
        return undefined;
    }

    search(pageNumber: string, keyword: string): Promise<Story[]> {
        return undefined;
    }

    static createInstance(pageNumber: string, category: string) {

        let url = `https://news.google.com/?hl=en-US&gl=US&ceid=US%3Aen`;
        return new GoogleStoryService(url);

    }

    getStories(): Promise<Story[]> {

        return new Promise<Story[]>(resolver => {
            axios.get("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=e60f99befdf44b02b7472b0cc82cb7d4")
                .then(response => {
                    let result = (<NEWS[]>response.data.articles).map(news => {

                        let storyImage = new StoryImage(news.urlToImage, 100, 100, "");
                        return new Story(news.title, news.title, news.description, [storyImage], news.url, new StoryMeta(news.source.name, news.publishedAt), false, false);
                    })
                    resolver(result);
                })

        });
    }

}
