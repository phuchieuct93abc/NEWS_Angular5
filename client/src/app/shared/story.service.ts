import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Story} from "../../../../model/Story";
import {map, retry} from "rxjs/operators";
import CONFIG from "../../environments/environment";

const storyUrl = CONFIG.baseUrl + `story`;
const searchUrl = CONFIG.baseUrl + `search`;

@Injectable({
    providedIn: 'root'
})
export class StoryService {
    private currentStoryPage = 0;

    private stories: Story[] = [];
    public onSearch = new Subject<string>()

    constructor(private httpClient: HttpClient) {

    }

    resetPageNumber() {
        this.currentStoryPage = 0;
        this.stories = [];
    }

    getStorySnapshot() {
        return this.stories;
    }

    getStories(category: string): Observable<any> {
        return this.httpClient.get(storyUrl, {
            params: {
                pageNumber: ++this.currentStoryPage + '',
                category: category
            }
        }).pipe(
            retry(3),
            map(
                result => {
                    let results = result as any[];
                    let stories: Story[] = results.map(this.storyConverter).filter(result => {
                        return this.stories.findIndex(story => story.id == result.id) == -1;
                    });
                    this.stories.push(...stories);


                    return this.stories
                }
            ));


    }

    search(keyword: string): Observable<any> {
        console.log('seach')
        return this.httpClient.get(searchUrl, {
            params: {
                pageNumber: ++this.currentStoryPage + '',
                keyword: keyword
            }
        }).pipe(
            retry(3),
            map(
                result => {
                    let results = result as any[];
                    let stories: Story[] = results.map(this.storyConverter).filter(result => {
                        return this.stories.findIndex(story => story.id == result.id) == -1;
                    });
                    this.stories.push(...stories);


                    return this.stories
                }
            ));
    }

    private storyConverter(rawData) {
        let {id, title, desc, images, originalUrl, storyMeta, hasVideo} = rawData;
        return new Story(id, title, desc, images, originalUrl, storyMeta, hasVideo);
    }

    getById(id: string) {
        return this.stories.find(s => s.id === id)
    }
}
