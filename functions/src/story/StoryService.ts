import {Story} from "../../../model/Story";
import {StoryParser} from "./StoryParser";
import Article from "../../../model/Article";
import BaomoiArticleService from "../article/baomoi/BaomoiArticleService";
import NotificationService from "../notification/notification.service";

const axios = require('axios');


export abstract class StoryService {
    readonly MAX_CACHE_NUMBER = 50;
    readonly MIN_RELATED_NOTIFY = 500;
    readonly MIN_LIKE_NOTIFY = 20;

    protected constructor(protected url: string, protected storyParser: StoryParser, protected category: string) {

    }


    public getStories(): Promise<Story[]> {
        return new Promise((resolve) => {
            axios.get(this.url).then(response => {
                const result = this.queryStories(response);
                let stories = Array.from(result)
                    .map(r => {
                        const a = this.storyParser.setData(r).parseStory();

                        return this.storyParser.setData(r).parseStory();

                    })
                    .filter(r => r != null);
                resolve(this.uniqueBy(stories));
            })
        })


    };

    abstract queryStories(data: any): any[];

    abstract search(pageNumber: string, keyword: string): Promise<Story[]>;


    public cache(): Promise<any> {
        return new Promise(resolver => {
            this.getStories().then(stories =>
                this.cacheArticles(stories).then((value) => resolver(value))
            )

        })

    }

    private async cacheArticles(stories): Promise<any> {
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

        await this.sendNotification(cachedArticle);

        return cachedArticle.map(article => {
            return {title: article.header, related: article.related}
        });


    }

    private async sendNotification(cachedArticle: Article[]) {
        let mostLikedArticles = cachedArticle.reduce((mostLiked: Article, current: Article) => {
            return mostLiked == undefined || current.likes > mostLiked.likes ? current : mostLiked;
        }, null);

        if (mostLikedArticles && mostLikedArticles.likes > this.MIN_LIKE_NOTIFY) {
            let notificationService = new NotificationService();
            await notificationService.send(mostLikedArticles, this.category);
        }
    }

    private cacheArticle = function (url): Promise<Article> {

        return new BaomoiArticleService(this.category).crawnArticleByIdAndSaveArticle(url)
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
