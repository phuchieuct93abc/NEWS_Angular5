import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Story} from "../../../../model/Story";
import {map, retry} from "rxjs/operators";
import CONFIG from "../../environments/environment";
import {LocalStorageService} from "./storage.service";
import {LoadingEventName, LoadingEventType, LoadingService} from "./loading.service";
import {FavoriteService} from "./favorite-story.service";

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

    constructor(private httpClient: HttpClient, private storage: LocalStorageService, private loadingService: LoadingService,
                private favoriteService: FavoriteService
    ) {
        this.readStory = <Story[]>storage.getItem(readId, []);

    }

    public resetPageNumber() {
        this.currentStoryPage = 0;
        this.stories = [];
    }

    getStories(category: string): Promise<any> {
        return new Promise<any>((resolve => {

            this.getStoryByPage(category, ++this.currentStoryPage).then(stories => {
                let result = this.filterStory(stories);
                this.appendStoryList(result)
                resolve(result);

            });
        }))


    }

    getStoriesFirstPage(category: string): Promise<any> {

        return this.getStoryByPage(category, 1);

    }

    private getStoryByPage(category: string, pageNumber: number): Promise<any> {
        if (category == 'yeu-thich') {
            return this.favoriteService.getStories();
        }
        if (CONFIG.isRunningInNode) {
            return Promise.resolve()
        }
        this.loadingService.onLoading.next({type: LoadingEventType.START, name: LoadingEventName.MORE_STORY})

        return this.httpClient.get(storyUrl, {
            params: {
                pageNumber: pageNumber + '',
                category: category
            }
        }).pipe(
            retry(3),
            map(
                result => {
                    this.loadingService.onLoading.next({
                        type: LoadingEventType.FINISH,
                        name: LoadingEventName.MORE_STORY
                    })

                    this.checkReadStory(<Story[]>result);

                    this.preloadArticle(<Story[]>result);

                    return result;
                }
            )).toPromise();

    }

    search(keyword: string): Promise<any> {
        if (CONFIG.isRunningInNode) {
            return Promise.resolve()
        }
        this.loadingService.onLoading.next({type: LoadingEventType.START, name: LoadingEventName.SEARCHING})
        return this.httpClient.get(searchUrl, {
            params: {
                pageNumber: ++this.currentStoryPage + '',
                keyword: keyword
            }
        }).pipe(
            retry(3),
            map(
                result => {
                    this.loadingService.onLoading.next({
                        type: LoadingEventType.FINISH,
                        name: LoadingEventName.SEARCHING
                    })
                    this.checkReadStory(<Story[]>result);
                    result = this.filterStory(result);
                    this.appendStoryList(result);
                    return result
                }
            )).toPromise();
    }

    private filterStory(result) {
        let stories: Story[] = (<Story[]>result).filter(result => {
            return this.stories.findIndex(story => story.id == result.id) == -1;
        });
        return stories;
    }

    private appendStoryList(moreStories) {
        this.stories.push(...moreStories);
    }

    saveReadStory(story: Story) {
        let item = <Story[]>this.storage.getItem(readId, []);
        item.push(story);
        this.storage.setItem(readId, item);

    }

    getById(id: string) {
        let story = this.stories.find(s => s.id == id);
        if (story == null) {
            story = this.favoriteService.findById(id);
        }
        return story
    }

    checkReadStory(stories: Story[]) {
        stories.filter(story => this.readStory.findIndex(readStory => readStory.id === story.id) >= 0)
            .forEach(read => read.isRead = true)
    }


    unshift(firstStory: Story) {
        this.stories.unshift(firstStory);
    }

    preloadArticle(result: Story[]) {
        console.log('preload')
        navigator.serviceWorker.ready.then((ready) => {
            setTimeout(() => {

                navigator.serviceWorker.controller.postMessage({
                    command: 'preload',
                    payload: result.map(story => story.id)
                })
            })

        });
    }
}
