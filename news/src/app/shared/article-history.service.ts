import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ArticleHistoryService {
  constructor(private httpClient: HttpClient) {}

  getReadArticle(): Observable<string[]> {
    return this.httpClient.get<string[]>('/api/articles/read');
  }
  readArticle(articleId: string, categoryId: string): Observable<{ articleId: string; categoryId: string }> {
    return this.httpClient.put('/api/articles/read', { articleId, categoryId }).pipe(
      map(() => ({
        articleId,
        categoryId,
      }))
    );
  }
}
