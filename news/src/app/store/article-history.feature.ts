import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, createFeature, on, props } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs';
import { ArticleHistoryService } from '../shared/article-history.service';
import { createRehydrateReducer } from './reducer';
export interface ArticleHistoryData {
  [key: string]: string[];
}
export const initialState: ArticleHistoryData = {};
export const readArticle = createAction('[Article] Read', props<{ articleId: string; categoryId: string }>());
export const readArticleSuccess = createAction('[Article] Read Article Success', props<{ articleId: string; categoryId: string }>());
export const getArticleHistory = createAction('[Article] Get History');
export const loadArticleHistorySuccess = createAction('[Article] Load History Success', props<ArticleHistoryData>());

export const articleHistoryReducer = createRehydrateReducer(
  'articleHistory',
  initialState,
  on(readArticleSuccess, (state, { articleId, categoryId }) => {
    const currentArticleId = state[categoryId] || [];
    const newArticleId: string[] = [...currentArticleId, articleId];
    return { ...state, ...{ [categoryId]: newArticleId } };
  }),
  on(loadArticleHistorySuccess, (_, data) => ({ ...data }))
);

export const articleHistoryFeature = createFeature({
  name: 'ArticleHistory',
  reducer: articleHistoryReducer,
});

@Injectable({ providedIn: 'root' })
export class ArticleEffect {
  $ = createEffect(() =>
    this.$action.pipe(
      ofType(getArticleHistory),
      mergeMap(() => this.articleHistoryService.getReadArticle()),
      map((articleHistory) => loadArticleHistorySuccess(articleHistory))
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
