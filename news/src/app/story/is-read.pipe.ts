import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take, takeWhile, tap } from 'rxjs/operators';

@Pipe({
  name: 'isRead',
})
export class IsReadPipe implements PipeTransform {
  constructor(private store: Store<{ articleHistory: { [key: string]: { articleId: string[] } } }>) {}
  transform(storyId: string, categoryId: string): Observable<boolean> {
    if (storyId == null) {
      return of(false);
    }
    return this.store.select('articleHistory').pipe(map(({ articleHistory }) => articleHistory[categoryId]?.includes(storyId)));
  }
}
