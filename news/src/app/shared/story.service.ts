import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';
import { Story } from '../../../../model/Story';
import CONFIG from '../../environments/environment';
import { LoadingEventName, LoadingEventType, LoadingService } from './loading.service';

const storyUrl = CONFIG.asiaUrl + `story`;

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  public onSearch = new Subject<string>();
  private currentStoryPage = 0;
  private currentPayload: unknown;

  private stories: Story[] = [];
  private storiesQueue: Story[] = [];

  public constructor(private httpClient: HttpClient, private loadingService: LoadingService) {}

  public getStoryByPage(category: string, pageNumber: number, payload: unknown): Observable<Story[]> {
    this.loadingService.onLoading.next({ type: LoadingEventType.START, name: LoadingEventName.MORE_STORY });

    return this.httpClient
      .get<{ payload: unknown; story: Story[] }>(storyUrl, {
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
        tap(({ payload: returnPayload }) => (this.currentPayload = returnPayload)),
        map(({ story }) => story.map((r) => Object.assign(new Story(), r)))
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
