import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, ActionReducerMap, StoreModule } from '@ngrx/store';
import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';
import { ArticleEffect } from './article.effect';
import { configFeature } from './config.reducer';
import { LoginEffect, loginFeature } from './login.effect';
import { articleHistoryReducer } from './reduces';
import { loadedStoriesFeature } from './story.reducer';
const reducers: ActionReducerMap<{ config; articleHistory }> = {
  articleHistory: articleHistoryReducer,
  config: configFeature.reducer,
  // loggedUser: loginFeature.reducer,
};

export const configStorage = (reducer: ActionReducer<any>): ActionReducer<any> => {
  const config: LocalStorageConfig = {
    keys: ['config', 'articleHistory', 'loggedUser'],
    rehydrate: true,
    removeOnUndefined: false,
  };

  return localStorageSync(config)(reducer);
};
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers, { metaReducers: [configStorage] }),
    StoreModule.forFeature(configFeature),
    StoreModule.forFeature(loginFeature),
    StoreModule.forFeature(loadedStoriesFeature),
    EffectsModule.forRoot([ArticleEffect, LoginEffect]),
  ],
  declarations: [],
})
export class AppStoreModule {}
