import {Story} from "../../../model/Story";
import {StoryParser} from "./StoryParser";
import Article from "../../../model/Article";
import BaomoiArticleService from "../article/baomoi/BaomoiArticleService";
import NotificationService from "../notification/notification.service";

const axios = require('axios');


export abstract class StoryService {
    readonly MAX_CACHE_NUMBER = 50;


    constructor(protected url: string, protected storyParser: StoryParser, protected category: string) {

    }


    public getStories(): Promise<Story[]> {
        return new Promise((resolve) => {
            axios.get(this.url).then(response => {
                const result: HTMLCollection = this.queryStories(response.data);
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


    public cache(): Promise<Article[]> {
        return new Promise(resolver => {
            this.getStories().then(stories =>
                this.cacheArticles(stories).then((value) => resolver(value))
            )

        })

    }

    private async cacheArticles(stories): Promise<Article[]> {
        let cacheResult: Article;
        let cachedArticle: Article[] = [];
        for (let i = 0; i < this.MAX_CACHE_NUMBER; i++) {
            let story = stories[i];
            cacheResult = await this.cacheArticle(story.id);
            if (cacheResult == null) {
                break;
            }
            cachedArticle.push(cacheResult);

        }

        let mostLikesArticles = cachedArticle.reduce((mostLikes: Article, current: Article) => {
            return mostLikes == undefined || current.likes > mostLikes.likes ? current : mostLikes;
        },null);
        if (mostLikesArticles && mostLikesArticles.likes > 5) {
            let noticationService = new NotificationService();
            await noticationService.send(mostLikesArticles, this.category);
        }

        return cachedArticle;


    }

    private cacheArticle = function (url): Promise<Article> {

        return new BaomoiArticleService().crawnArticleByIdAndSaveArticle(url)
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
