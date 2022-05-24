import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { ArticleHistoryService } from '../shared/article-history.service';
import { ArticleService } from '../shared/article.service';
import { getArticleHistory, loadArticleHistorySuccess, readArticle, readArticleSuccess } from './actions';

@Injectable({ providedIn: 'root' })
export class ArticleEffect {
  getReadArticle$ = createEffect(() =>
    this.$action.pipe(
      ofType(getArticleHistory),
      mergeMap(() => this.articleHistoryService.getReadArticle()),
      map((articleHistory) => loadArticleHistorySuccess({ articleHistory }))
    )
  );
  readArticle$ = createEffect(() =>
    this.$action.pipe(
      ofType(readArticle),
      mergeMap(({ articleId, categoryId }) => this.articleHistoryService.readArticle(articleId, categoryId)),
      map(({ articleId, categoryId }) => readArticleSuccess({ articleId: articleId, categoryId: categoryId }))
    )
  );
  constructor(private $action: Actions, private articleHistoryService: ArticleHistoryService) {}
}
