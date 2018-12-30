import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Story} from "../../../../model/Story";
import {map, retry} from "rxjs/operators";
import CONFIG from "../../environments/environment";
import {LocalStorageService} from "./storage.service";

const storyUrl = CONFIG.baseUrl + `story`;
const searchUrl = CONFIG.baseUrl + `search`;
const readId = "read"

@Injectable({
    providedIn: 'root'
})
export class StoryService {
    private currentStoryPage = 0;

    private stories: Story[] = [];
    public onSearch = new Subject<string>();
    private readStory: Story[];

    constructor(private httpClient: HttpClient, private storage: LocalStorageService) {
        this.readStory = <Story[]>storage.getItem(readId, []);

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
                    this.checkReadStory();

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
                    this.checkReadStory();

                    return this.stories
                }
            ));
    }

    private storyConverter(rawData) {
        let {id, title, desc, images, originalUrl, storyMeta, hasVideo} = rawData;
        return new Story(id, title, desc, images, originalUrl, storyMeta, hasVideo);
    }


    saveReadStory(story: Story) {
        let item = <Story[]>this.storage.getItem(readId, []);
        item.push(story);
        this.storage.setItem(readId, item);

    }

    getById(id: string) {
        return this.stories.find(s => s.id === id)
    }

    checkReadStory() {
        this.stories.filter(story => this.readStory.findIndex(readStory => readStory.id === story.id) >= 0)
            .forEach(read => read.isRead = true)
    }
}
