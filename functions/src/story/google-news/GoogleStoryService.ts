import {Story} from "../../../../model/Story";
import {StoryService} from "../StoryService";
import GoogleStoryParser from "./GoogleStoryParser";

import axios from 'axios';
import {NEWS} from "./NEWS";
import StoryImage from "../../../../model/StoryImage";
import StoryMeta from "../../../../model/StoryMeta";


export default class GoogleStoryService extends StoryService {
    public pageNumber: number;
    public category: string;
    private headline = "https://newsapi.org/v2/top-headlines";

    constructor(protected url: string) {
        super(url, new GoogleStoryParser(),null)
    }


    queryStories(dom: Document): HTMLCollection {
        return undefined;
    }

    search(pageNumber: string, keyword: string): Promise<Story[]> {
        return undefined;
    }

    static createInstance(pageNumber: number, category: string) {

        const googleStoryService = new GoogleStoryService("url");
        googleStoryService.pageNumber = pageNumber;
        googleStoryService.category = category;
        return googleStoryService;

    }

    getStories(): Promise<Story[]> {

        return new Promise<Story[]>(resolver => {
            if(this.pageNumber>5){
                resolver([])
            }
            axios.get(this.headline, {
                params: {
                    category: this.category,
                    page: this.pageNumber,
                    apiKey: "e60f99befdf44b02b7472b0cc82cb7d4",
                    country: "us"
                }
            })
                .then(response => {
                    let result = (<NEWS[]>response.data.articles).map(news => {

                        let storyImage = new StoryImage(news.urlToImage, 100, 100, "");
                        let title =  news.title;
                        title = title.substr(0,title.lastIndexOf("-"))
                        return new Story(news.url, title, news.description, [storyImage], news.url, new StoryMeta(news.source.name, news.publishedAt), false, false);
                    })
                    resolver(result);
                })

        });
    }

}
