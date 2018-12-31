import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StoryService} from "./story.service";
import {EMPTY, Observable, Subject} from "rxjs";
import {map, retry} from "rxjs/operators";
import Article from "../../../../model/Article";
import CONFIG from "../../environments/environment";
import {Story} from "../../../../model/Story";


@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    public onStorySelected = new Subject<Article>();

    constructor(private httpClient: HttpClient, private storyService: StoryService) {
    }

    getById(id: string): Observable<Article> {

        const story: Story = this.storyService.getById(id);

        if (story == null) {
            return EMPTY;
        }
        this.storyService.saveReadStory(story);
        const options = {
            params: {
                url: story.originalUrl
            }
        };
        return this.httpClient.get(CONFIG.baseUrl + "article", options).pipe(
            retry(3),
            map(result =>
                new Article(result['id'], result['header'], null, result['body'], null,story)
            ))
    }


}
