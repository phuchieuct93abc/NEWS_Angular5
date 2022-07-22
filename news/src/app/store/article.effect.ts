import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { ArticleHistoryService } from '../shared/article-history.service';
import { ArticleService } from '../shared/article.service';
import { getArticleHistory, loadArticleHistorySuccess, readArticle, readArticleSuccess } from './actions';
import { ArticleHistoryData } from './reduces';

@Injectable({ providedIn: 'root' })
export class ArticleEffect {
  $ = createEffect(() =>
    this.$action.pipe(
      ofType(getArticleHistory),
      mergeMap(() => this.articleHistoryService.getReadArticle()),
      map((articleHistory) => loadArticleHistorySuccess({ articleHistory } as ArticleHistoryData))
    )
  );
  readArticle$ = createEffect(() =>
    this.$action.pipe(
      ofType(readArticle),
      tap(({ articleId, categoryId }) => this.articleHistoryService.readArticle(articleId, categoryId).subscribe()),
      map(({ articleId, categoryId }) => readArticleSuccess({ articleId, categoryId }))
    )
  );
  constructor(private $action: Actions, private articleHistoryService: ArticleHistoryService) {}
}
