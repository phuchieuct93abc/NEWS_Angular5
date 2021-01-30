import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';
import { Story } from '../../../../model/Story';
import CONFIG from '../../environments/environment';
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
    private readStory: Story[];

    public constructor(
        private httpClient: HttpClient,
        private storage: LocalStorageService,
        private loadingService: LoadingService,
        private favoriteService: FavoriteService,
    ) {
        this.readStory = storage.getItem(readId, []) as Story[];

    }

    public resetPageNumber() {
        this.currentStoryPage = 0;
        this.stories = [];
    }

   public getStories(category: string): Observable<Story[]> {

            return this.getStoryByPage(category, ++this.currentStoryPage).pipe(
                tap((stories) => {
                const result = this.filterStory(stories);
                this.appendStoryList(result);

            }));


    }

    public getStoriesFirstPage(category: string): Observable<any> {

        return this.getStoryByPage(category, 1);

    }

    public search(keyword: string): Observable<any> {
        if (CONFIG.isRunningInNode) {
            return of();
        }
        this.loadingService.onLoading.next({type: LoadingEventType.START, name: LoadingEventName.SEARCHING});
        return this.httpClient.get(searchUrl, {
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
                    this.checkReadStory(result as Story[]) ;
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
        console.log('get article by id',this.stories.length+1);
        let story = this.stories.find((s) => s.id == id);
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
    private filterStory(result) {
        const stories: Story[] = (<Story[]>result).filter((result) => this.stories.findIndex((story) => story.id == result.id) == -1);
        return stories;
    }

    private appendStoryList(moreStories) {
        this.stories.push(...moreStories);
    }

    private getStoryByPage(category: string, pageNumber: number): Observable<any> {
        if (category == 'yeu-thich') {
            return this.favoriteService.getStories();
        }
        if (CONFIG.isRunningInNode) {
            return of();
        }
        this.loadingService.onLoading.next({type: LoadingEventType.START, name: LoadingEventName.MORE_STORY});

        return this.httpClient.get(storyUrl, {
            params: {
                pageNumber: pageNumber + '',
                category,
            },
        }).pipe(
            retry(3),
            map(
                (result) => {
                    this.loadingService.onLoading.next({
                        type: LoadingEventType.FINISH,
                        name: LoadingEventName.MORE_STORY,
                    });

                    this.checkReadStory(result as Story[]);
                    return result;
                },
                ));

    }
}
