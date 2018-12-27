import {Story} from "../../../model/Story";
import {StoryService} from "../StoryService";
import GoogleStoryParser from "./GoogleStoryParser";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');

export interface GoogleArticle {
    "source": {
        "id": string,
        "name": string
    },
    "author": string,
    "title": string,
    "description": string,
    "url": string,
    "urlToImage": string,
    "publishedAt": string,
    "content": string
}

export default class GoogleStoryService extends StoryService {
    private APIKEY = "e60f99befdf44b02b7472b0cc82cb7d4"

    constructor() {
        super();
        this.storyParser = new GoogleStoryParser();
    }

    getStories(pageNumber: string, category: string): Promise<Story[]> {
        return new Promise((resolve) => {
            const url = "https://newsapi.org/v2/top-headlines?apiKey=e60f99befdf44b02b7472b0cc82cb7d4&category=technology&country=us";
            axios.get(url, {
                data: {
                    country: 'us',
                    category: "technology",
                    "apiKey": this.APIKEY
                }
            }).then(response => {
                const data: GoogleArticle[] = response.data.articles;

                resolve(data.map(d => this.storyParser.setRawData(d).parseStory()))
            }, error => {
                console.log(error)
            })
        })


    }

}