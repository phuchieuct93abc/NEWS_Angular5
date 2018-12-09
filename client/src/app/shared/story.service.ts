import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Story} from "../../../../model/Story";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class StoryService {
    constructor(private httpClient: HttpClient) {

    }

    getStories(): Observable<any> {
        console.log("call")
        return this.httpClient.get("http://localhost:3000").pipe(map(
            (result) => {
                let results = result as any[];
                return results.map(story => {
                    return story == null ? null : new Story(story['id'], story['title'], story['desc'], story['imagePath'], story['originalUrl'])
                })
            }
        ));

    }
}
