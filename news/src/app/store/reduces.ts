import { Action, createReducer, on } from '@ngrx/store';
import { loadArticleHistorySuccess, readArticle } from './actions';
export const initialState = [];

export const articleHistoryReducer = createReducer(
  initialState,
  on(readArticle, (state, { articleId }) => ({ ...state, articleId })),
  on(loadArticleHistorySuccess, (state, { articleHistory }) => ({ ...state, articleHistory }))
);
