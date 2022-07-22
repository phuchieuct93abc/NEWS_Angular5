import { createReducer, on } from '@ngrx/store';
import { loadArticleHistorySuccess, readArticleSuccess } from './actions';
export interface ArticleHistoryData {
  articleHistory: {
    [key: string]: string[];
  };
}
export const initialState: ArticleHistoryData = { articleHistory: {} };

export const articleHistoryReducer = createReducer(
  initialState,
  on(readArticleSuccess, (state, { articleId, categoryId }) => {
    const currentArticleId = state.articleHistory[categoryId] || [];
    const newArticleId: string[] = [...currentArticleId, articleId];
    return { articleHistory: { ...state.articleHistory, ...{ [categoryId]: newArticleId } } };
  }),
  on(loadArticleHistorySuccess, (state, data) => data)
);
