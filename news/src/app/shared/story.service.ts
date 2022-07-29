import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';
import { Story } from '../../../../model/Story';
import environment from '../../environments/environment';
import { addStoryAction } from '../store/story.reducer';
import { LoadingEventName, LoadingEventType, LoadingService } from './loading.service';

const storyUrl = environment.asiaUrl + `story`;

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  public onSearch = new Subject<string>();
  private currentStoryPage = 0;
  private currentPayload: unknown;

  private stories: Story[] = [];
  private storiesQueue: Story[] = [];

  public constructor(private httpClient: HttpClient, private loadingService: LoadingService, private store: Store) {}

  public getStoryByPage(category: string, pageNumber: number, payload: string): Observable<{ story: Story[]; payload: string }> {
    this.loadingService.onLoading.next({ type: LoadingEventType.START, name: LoadingEventName.MORE_STORY });

    return this.httpClient
      .get<{ story: Story[]; payload: string }>(storyUrl, {
        params: {
          pageNumber: `${pageNumber}`,
          category,
          payload: JSON.stringify(payload),
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
        tap(({ story: stories }) => {
          stories.forEach((story) => this.store.dispatch(addStoryAction({ category, story })));
        }),
        map((result) => ({ payload: result.payload, story: result.story.map((r) => Object.assign(new Story(), r)) }))
      );
  }

  public resetPageNumber(): void {
    this.currentStoryPage = 1;
    this.stories = [];
    this.storiesQueue = [];
  }

  public getStories(category: string, numberOfStories: number = 5): Observable<Story[]> {
    if (this.storiesQueue.length > 0) {
      return of(this.storiesQueue.splice(0, numberOfStories));
    }

    return this.getStoryByPage(category, this.currentStoryPage, this.currentPayload).pipe(
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
    return this.getStoryByPage(category, 1, null);
  }

  public getById(id: string): Story {
    return this.stories.find((s) => s.id === id);
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
