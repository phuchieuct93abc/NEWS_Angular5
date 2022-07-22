import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { loginFeature } from '../store/login.effect';

@Injectable({
  providedIn: 'root',
})
export class ArticleHistoryService {
  constructor(private httpClient: HttpClient, private store: Store) {}

  getReadArticle(): Observable<unknown> {
    return this.store.select(loginFeature.selectUser).pipe(
      switchMap((user) => {
        if (user?.idToken) {
          return this.httpClient.get<string[]>('/api/articles/read', { params: { googleId: user?.idToken } });
        }
        throw new Error('No Google login');
      })
    );
  }
  readArticle(articleId: string, categoryId: string): Observable<{ articleId: string; categoryId: string }> {
    return this.store.select(loginFeature.selectUser).pipe(
      switchMap((user) => {
        if (user?.idToken) {
          return this.httpClient.put('/api/articles/read', { articleId, categoryId }, { params: { googleId: user?.idToken } });
        }
        return of();
      }),
      map(() => ({
        articleId,
        categoryId,
      }))
    );
  }
}
