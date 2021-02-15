import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Story } from '../../../../model/Story';
import CONFIG from '../../environments/environment';
import { IS_NODE } from './const';
import { Cache } from './cache.service';
import { FavoriteService } from './favorite-story.service';
import { LoadingEventName, LoadingEventType, LoadingService } from './loading.service';
import { LocalStorageService } from './storage.service';

const storyUrl = CONFIG.baseUrl + `story`;
const searchUrl = CONFIG.baseUrl + `search`;
const readId = 'read';

@Injectable({
    providedIn: 'root',
})
export class StoryService {
    public onSearch = new Subject<string>();
    private currentStoryPage = 0;

    private stories: Story[] = [];
    private storiesQueue: Story[] = [];
    private readStory: Story[];

    public constructor(
        private httpClient: HttpClient,
        private storage: LocalStorageService,
        private loadingService: LoadingService,
        private favoriteService: FavoriteService,
        @Inject(IS_NODE) private isNode: boolean,
        private transferState: TransferState,
    ) {
        this.readStory = storage.getItem(readId, []) as Story[];
    }

    @Cache()
    public getStoryByPage(category: string, pageNumber: number): Observable<Story[]> {
        const COURSE_KEY = makeStateKey<Story[]>(`stories-${category}-${pageNumber}`);

        if (this.transferState.hasKey(COURSE_KEY)) {
            const stories = this.transferState.get<Story[]>(COURSE_KEY, null);
            
            return of(stories.map((story)=>Object.assign(new Story(),story)));
        }
        if (category === 'yeu-thich') {
            return this.favoriteService.getStories();
        }
        // if (CONFIG.isRunningInNode) {
        //     return of();
        // }
        this.loadingService.onLoading.next({ type: LoadingEventType.START, name: LoadingEventName.MORE_STORY });

        return this.httpClient.get<Story[]>(storyUrl, {
            params: {
                pageNumber: pageNumber + '',
                category,
            },
        }).pipe(
            retry(3),
            map(
                (result) => {
                    result = result.map((r) => (Object.assign(new Story(), r)));

                    this.loadingService.onLoading.next({
                        type: LoadingEventType.FINISH,
                        name: LoadingEventName.MORE_STORY,
                    });


                    this.checkReadStory(result);
                    if (this.isNode) {
                        this.transferState.set(COURSE_KEY, result.splice(0,20)); 

                    }
                    return result;
                },
            ));

    }

    public resetPageNumber() {
        this.currentStoryPage = 0;
        this.stories = [];
        this.storiesQueue = [];
    }

    public getStories(category: string, numberOfStories: number = 5): Observable<Story[]> {
        if (this.storiesQueue.length > 0) {
            return of(this.storiesQueue.splice(0, numberOfStories));
        }

        return this.getStoryByPage(category, this.currentStoryPage).pipe(
            map((stories: Story[]) => {
                const result = this.filterStory(stories);
                this.appendStoryList(result);
                this.storiesQueue = result;
                this.currentStoryPage++;
                return result;
            }), map(() => this.storiesQueue.splice(0, numberOfStories)));
    }


    public getStoriesFirstPage(category: string): Observable<any> {

        return this.getStoryByPage(category, 1);

    }

    public search(keyword: string): Observable<any> {
        if (this.isNode) {
            return of();
        }
        this.loadingService.onLoading.next({ type: LoadingEventType.START, name: LoadingEventName.SEARCHING });
        return this.httpClient.get<Story[]>(searchUrl, {
            params: {
                pageNumber: ++this.currentStoryPage + '',
                keyword,
            },
        }).pipe(
            retry(3),
            map(
                (result) => {
                    this.loadingService.onLoading.next({
                        type: LoadingEventType.FINISH,
                        name: LoadingEventName.SEARCHING,
                    });

                    result = result.map((r) => (Object.assign(new Story(), r)));
                    this.checkReadStory(result);
                    result = this.filterStory(result);
                    this.appendStoryList(result);
                    return result;
                },
            ));
    }


    public saveReadStory(story: Story) {
        const item = this.storage.getItem(readId, []) as Story[];
        item.push(story);
        this.storage.setItem(readId, item);

    }

    public getById(id: string) {
        let story = this.stories.find((s) => s.id === id);
        if (story == null) {
            story = this.favoriteService.findById(id);
        }
        return story;
    }

    public checkReadStory(stories: Story[]) {
        stories.filter((story) => this.readStory.findIndex((readStory) => readStory.id === story.id) >= 0)
            .forEach((read) => read.isRead = true);
    }


    public unshift(firstStory: Story) {
        this.stories.unshift(firstStory);
    }


    private filterStory(stories: Story[]) {
        return stories.filter((result) => this.stories.findIndex((story) => story.id === result.id) === -1);
    }

    private appendStoryList(moreStories) {
        this.stories.push(...moreStories);
    }
}
