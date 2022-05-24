import { createAction, props } from '@ngrx/store';

export const readArticle = createAction('[Article] Read', props<{ articleId: string; categoryId: string }>());
export const readArticleSuccess = createAction('[Article] Read Article Success', props<{ articleId: string; categoryId: string }>());
export const getArticleHistory = createAction('[Article] Get History');
export const loadArticleHistorySuccess = createAction('[Article] Load History Success', props<{ articleHistory: string[] }>());
