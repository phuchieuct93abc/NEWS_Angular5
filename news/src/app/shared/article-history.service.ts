import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleHistoryService {
  constructor(private httpClient: HttpClient) {}

  getReadArticle(): Observable<string[]> {
    return this.httpClient.get<string[]>('/api/articles/read');
  }
  readArticle(articleId: string, categoryId: string): Observable<any> {
    return this.httpClient.put('/api/articles/read', { articleId, categoryId });
  }
}
