import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, retry, tap } from 'rxjs/operators';
import { Story } from '../../../../model/Story';
import environment from '../../environments/environment';
import { LoadingEventName, LoadingEventType, LoadingService } from './loading.service';

const storyUrl = environment.asiaUrl + `story`;

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  public onSearch = new Subject<string>();

  public constructor(private httpClient: HttpClient, private loadingService: LoadingService) {}

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
        map((result) => ({ payload: result.payload, story: result.story.map((r) => Object.assign(new Story(), r)) }))
      );
  }
}
