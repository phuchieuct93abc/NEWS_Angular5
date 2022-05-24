import { createReducer, on } from '@ngrx/store';
import { loadArticleHistorySuccess, readArticleSuccess } from './actions';
export const initialState = { articleHistory: {} };

export const articleHistoryReducer = createReducer(
  initialState,
  on(readArticleSuccess, (state, { articleId, categoryId }) => {
    const currentArticleId = state.articleHistory[categoryId]?.articleId || [];
    const newArticleId = [...currentArticleId, articleId];
    const newState = { articleHistory: { ...state.articleHistory, [categoryId]: { articleId: newArticleId } } };
    console.log(state, newState);
    return { ...state, ...newState };
  }),
  on(loadArticleHistorySuccess, (state, { articleHistory }) => ({ ...state, articleHistory }))
);
