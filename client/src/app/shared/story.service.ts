import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Story} from "../../../../model/Story";
import {map} from "rxjs/operators";
import CONFIG from "../config";

@Injectable({
    providedIn: 'root'
})
export class StoryService {
    private stories: Story[] = []

    constructor(private httpClient: HttpClient) {

    }

    getStories(): Observable<any> {
        return this.httpClient.get(CONFIG.baseUrl).pipe(map(
            (result) => {
                let results = result as any[];
                return results.map(s => {
                    const story = new Story(s['id'], s['title'], s['desc'], s['imagePath'], s['originalUrl']);
                    this.stories.push(story);
                    return story;
                })
            }
        ));

    }

    getById(id: string) {
        return this.stories.find(s => s.id === id)
    }
}
