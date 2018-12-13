import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Story} from "../../../../model/Story";
import {map} from "rxjs/operators";
import CONFIG from "../config";

const storyUrl = CONFIG.baseUrl + `story`;

@Injectable({
    providedIn: 'root'
})
export class StoryService {
    private currentStoryPage = 0;

    private stories: Story[] = [];

    constructor(private httpClient: HttpClient) {

    }

    resetPageNumber() {
        this.currentStoryPage = 0;
        this.stories = [];
    }

    getStories(category: string): Observable<any> {
        return this.httpClient.get(storyUrl, {
            params: {
                pageNumber: ++this.currentStoryPage + '',
                category: category
            }
        }).pipe(map(
            result => {
                let results = result as any[];
                let stories: Story[] = results.map(this.storyConverter);
                this.stories.push(...stories);
                return this.stories
            }
        ));

    }

    private storyConverter(rawData) {
        return new Story(rawData['id'], rawData['title'], rawData['desc'], rawData['imagePath'], rawData['originalUrl']);
    }

    getById(id: string) {
        return this.stories.find(s => s.id === id)
    }
}
