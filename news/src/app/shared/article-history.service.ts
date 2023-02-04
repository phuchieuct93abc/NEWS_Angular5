import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import environment from 'src/environments/environment';
import { ArticleHistoryData } from '../store/article-history.feature';

@Injectable({
  providedIn: 'root',
})
export class ArticleHistoryService {
  constructor(private httpClient: HttpClient, private store: Store, private auth: AngularFireAuth) {}

  getReadArticle(): Observable<ArticleHistoryData> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        if (user) {
          return user.getIdTokenResult(false);
        }
        return of();
      }),
      switchMap(({ token }) => {
        if (token) {
          return this.httpClient.get<ArticleHistoryData>(`${environment.baseUrl}/articles/read`, { params: { googleId: token } });
        }
        throw new Error('No Google login');
      })
    );
  }

  readArticle(articleId: string, categoryId: string): Observable<{ articleId: string; categoryId: string }> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        if (user) {
          return user.getIdTokenResult(false);
        }
        return of();
      }),
      switchMap(({ token }) => {
        if (token) {
          return this.httpClient.put(`${environment.baseUrl}/articles/read`, { articleId, categoryId }, { params: { googleId: token } });
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
