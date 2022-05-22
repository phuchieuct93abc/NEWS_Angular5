import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { map, retry, switchMap, tap } from 'rxjs/operators';
import { Story } from '../../../../model/Story';
import CONFIG from '../../environments/environment';
import { readArticle } from '../store/actions';
import { LoadingEventName, LoadingEventType, LoadingService } from './loading.service';
import { LocalStorageService } from './storage.service';

const storyUrl = CONFIG.asiaUrl + `story`;
const searchUrl = CONFIG.asiaUrl + `search`;

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  public onSearch = new Subject<string>();
  private currentStoryPage = 0;

  private stories: Story[] = [];
  private storiesQueue: Story[] = [];

  public constructor(
    private httpClient: HttpClient,
    private storage: LocalStorageService,
    private loadingService: LoadingService,
    private articleHistory: Store<{ articleHistory }>
  ) {}

  public getStoryByPage(category: string, pageNumber: number): Observable<Story[]> {
    this.loadingService.onLoading.next({ type: LoadingEventType.START, name: LoadingEventName.MORE_STORY });

    return this.httpClient
      .get<Story[]>(storyUrl, {
        params: {
          pageNumber: pageNumber + '',
          category,
        },
      })
      .pipe(
        retry(3),
        tap(() =>
          this.loadingService.onLoading.next({
            type: LoadingEventType.FINISH,
            name: LoadingEventName.MORE_STORY,
          })
        ),
        map((result) => result.map((r) => Object.assign(new Story(), r))),
        switchMap((result) => this.checkReadStory(result))
      );
  }

  public resetPageNumber() {
    this.currentStoryPage = 1;
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
      }),
      map(() => this.storiesQueue.splice(0, numberOfStories))
    );
  }

  public getStoriesFirstPage(category: string): Observable<Story[]> {
    return this.getStoryByPage(category, 1);
  }

  public saveReadStory(story: Story): void {
    this.articleHistory.dispatch(readArticle({ articleId: story.id }));
    this.storage.setItem(`${story.id}-read`, true);
  }

  public getById(id: string): Story {
    return this.stories.find((s) => s.id === id);
  }

  public checkReadStory(stories: Story[]): Observable<Story[]> {
    return forkJoin(stories.map((story) => this.storage.getItem(`${story.id}-read`, false))).pipe(
      map((results) => {
        stories.forEach((story, index) => (story.isRead = results[index]));
        return stories;
      })
    );
  }

  public unshift(firstStory: Story): void {
    this.stories.unshift(firstStory);
  }

  private filterStory(stories: Story[]) {
    return stories.filter((result) => this.stories.findIndex((story) => story.id === result.id) === -1);
  }

  private appendStoryList(moreStories: Story[]) {
    this.stories.push(...moreStories);
  }
}
