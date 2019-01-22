import {Story} from "../../../model/Story";
import {StoryParser} from "./StoryParser";
import Article from "../../../model/Article";
import ArticleServiceFactory from "../article/ArticleServiceFactory";


export abstract class StoryService {
    readonly MAX_CACHE_NUMBER = 50;
    protected storyParser: StoryParser;

    abstract getStories(pageNumber: string, category: string): Promise<Story[]>;

    abstract search(pageNumber: string, keyword: string): Promise<Story[]>;


    public cache(pageNumber: string, category: string): Promise<string> {
        return new Promise(resolver => {
            this.getStories(pageNumber, category).then(stories =>
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
        // return stories.reduce(
        //     (acc, cur: Story) => acc.some(x => (x.id === cur.id) ? acc : acc.concat(cur), [])
        // );
        const result = []
        stories.forEach(story => {
            if (!result.some(x => x.id === story.id)) {
                result.push(story)
            }
        });
        return result;


    }
}