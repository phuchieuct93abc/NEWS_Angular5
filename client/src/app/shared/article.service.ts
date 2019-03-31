import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StoryService} from "./story.service";
import {Observable, Subject} from "rxjs";
import {map, retry} from "rxjs/operators";
import Article from "../../../../model/Article";
import CONFIG from "../../environments/environment";
import {Story} from "../../../../model/Story";
import ArticleComment from "../../../../model/ArticleComment";
import {MetaService} from "./meta.service";


@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    public onStorySelected = new Subject<Article>();

    constructor(private httpClient: HttpClient, private storyService: StoryService, private  meta: MetaService) {
    }

    getById(id: string): Observable<Article> {
        const story: Story = this.storyService.getById(id);

        if (story != null) {
            this.storyService.saveReadStory(story);

        }
        const options = {
            params: {
                url: id
            }
        };
        console.time("api" + id);
        return this.httpClient.get(CONFIG.baseUrl + "article", options).pipe(
            retry(3),
            map(result => {
                let article = <Article>result;
                article.story = story;
                this.meta.updateMeta(article);
                console.error("update meta");
                console.timeEnd("api" + id);

                return article;
            }))
    }

    getSource(id: string): Observable<string> {
        return this.httpClient.get(CONFIG.baseUrl + "getSource", {
            params: {
                id: id
            }
        }).pipe(retry(3), map(source => source['url']))
    }

    getComment(id: string): Observable<ArticleComment[]> {
        return this.httpClient.get(CONFIG.baseUrl + "comments", {
            params: {
                id: id
            }
        }).pipe(retry(3), map(comments => <ArticleComment[]>comments))
    }


}
