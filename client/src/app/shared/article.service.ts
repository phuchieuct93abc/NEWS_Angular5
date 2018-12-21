import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StoryService} from "./story.service";
import {EMPTY, Observable} from "rxjs";
import {map, retry} from "rxjs/operators";
import Article from "../../../../model/Article";
import CONFIG from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    constructor(private httpClient: HttpClient, private storyService: StoryService) {
    }

    getById(id: string): Observable<Article> {
        const story = this.storyService.getById(id);
        if (story == null) {
            return EMPTY;
        }
        const options = {
            params: {
                url: story.originalUrl
            }
        };
        return this.httpClient.get(CONFIG.baseUrl + "article", options).pipe(
            retry(3),
            map(result =>
                new Article(result['id'], result['header'], null, result['body'], null)
            ))
    }
}
