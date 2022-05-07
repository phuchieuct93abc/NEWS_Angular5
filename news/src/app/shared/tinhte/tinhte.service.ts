import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Article from '../../../../../model/Article';
import { Story } from '../../../../../model/Story';
import TinhteArticleParser from './tinhte-article-parser.service';
import TinhteStoryParser from './tinhte-story-parser.service';
import { Thread, TinhTeArticle, TinhTeStories } from './tinhte.type';

@Injectable({
  providedIn: 'root',
})
export class TinhTeService {
  constructor(private httpClient: HttpClient) {}
  readonly storiesApi =
    'https://tinhte.vn/appforo/index.php?threads/promoted&limit=30&page=${page}&oauth_token=0%2C1651911573%2C6d17f9b60594ac20c3ed8e11b65c242d%2Clxi7g2zolu';
  readonly articleApi =
    'https://tinhte.vn/appforo/index.php?/threads/${id}&oauth_token=0%2C1651911573%2C6d17f9b60594ac20c3ed8e11b65c242d%2Clxi7g2zolu';

  getStories(pageNumber: number): Observable<Story[]> {
    return this.httpClient.get<TinhTeStories>(this.storiesApi.replace('${page}', pageNumber + '')).pipe(
      map((tinhteStories) => {
        return tinhteStories.threads.map((story) => new TinhteStoryParser(story).parseStory());
      })
    );
  }

  getArticle(id: string): Observable<Article> {
    return this.httpClient
      .get<TinhTeArticle>(this.articleApi.replace('${id}', id))
      .pipe(map((article) => new TinhteArticleParser(article.thread).parserArticle()));
  }
}
