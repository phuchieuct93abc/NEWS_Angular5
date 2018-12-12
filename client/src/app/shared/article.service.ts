import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import CONFIG from "../config";
import {StoryService} from "./story.service";
import {EMPTY, Observable} from "rxjs";
import {map} from "rxjs/operators";
import Article from "../../../../model/Article";

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
        return this.httpClient.get(CONFIG.baseUrl + "article", {
            params: {
                url: story.originalUrl
            }
        }).pipe(map(
            (result) =>
                new Article(result['id'], result['header'], null, result['body'], null)
        ))
    }
}
