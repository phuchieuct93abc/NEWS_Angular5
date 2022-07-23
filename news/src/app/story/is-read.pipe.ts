import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { articleHistoryFeature } from '../store/article-history.feature';

@Pipe({
  name: 'isRead',
})
export class IsReadPipe implements PipeTransform {
  constructor(private store: Store<{ articleHistory: { articleHistory: { [key: string]: string[] } } }>) {}
  transform(storyId: string, categoryId: string): Observable<boolean> {
    if (storyId == null) {
      return of(false);
    }
    return this.store
      .select(articleHistoryFeature.selectArticleHistoryState)
      .pipe(map((articleHistory) => articleHistory?.[categoryId]?.includes(storyId)));
  }
}
