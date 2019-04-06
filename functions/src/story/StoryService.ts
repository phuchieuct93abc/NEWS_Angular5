import {Story} from "../../../model/Story";
import {StoryParser} from "./StoryParser";
import Article from "../../../model/Article";
import ArticleServiceFactory from "../article/ArticleServiceFactory";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');


export abstract class StoryService {
    readonly MAX_CACHE_NUMBER = 50;


    constructor(protected url: string, protected storyParser: StoryParser) {

    }


    public getStories(): Promise<Story[]> {
        return new Promise((resolve) => {
            axios.get(this.url).then(response => {
                const dom = new JSDOM(response.data);
                const result: HTMLCollection = this.queryStories(dom.window.document);
                let stories = Array.from(result)
                    .map(r => {
                        return this.storyParser.setHtml(r).parseStory();

                    })
                    .filter(r => r != null);
                resolve(this.uniqueBy(stories));
            })
        })


    };

    abstract queryStories(dom: Document): HTMLCollection;

    abstract search(pageNumber: string, keyword: string): Promise<Story[]>;


    public cache(): Promise<string> {
        return new Promise(resolver => {
            this.getStories().then(stories =>
                this.cacheArticles(stories).then(() => resolver("ok"))
            )

        })

    }

    private cacheArticles(stories): Promise<any> {
        let promise = this.cacheArticle(stories[0].id);
        for (let i = 1; i < this.MAX_CACHE_NUMBER; i++) {
            promise = (function (story: Story) {
                return promise.then((value) => {
                    if (value) {
                        return this.cacheArticle(story.id)
                    } else {
                        return Promise.resolve(null);
                    }
                })
            }).bind(this)(stories[i]);
        }
        return promise;
    }

    private cacheArticle = function (url): Promise<Article> {
        return ArticleServiceFactory.get("vi").crawnArticleByIdAndSaveArticle(url)
    };

    protected uniqueBy(stories): Story[] {
        const result = []
        stories.forEach(story => {
            if (!result.some(x => x.id === story.id)) {
                result.push(story)
            }
        });
        return result;


    }
}
