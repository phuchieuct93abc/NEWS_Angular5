import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';
import CONFIG from 'src/environments/environment';
import { ArticleEffect, articleHistoryFeature, articleHistoryReducer } from './article-history.feature';

import { configFeature } from './config.reducer';
import { LocalStoreService } from './local-store.service';
import { LoginEffect, loginFeature } from './login.effect';
import { loadedStoriesFeature } from './story.reducer';

export const configStorage = (reducer: ActionReducer<any>): ActionReducer<any> => {
  const config: LocalStorageConfig = {
    keys: ['articleHistory', 'loggedUser'],
    rehydrate: true,
    removeOnUndefined: false,
  };

  return localStorageSync(config)(reducer);
};
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(configFeature),
    StoreModule.forFeature(loadedStoriesFeature),
    StoreModule.forFeature(loginFeature),
    StoreModule.forFeature(articleHistoryFeature),
    EffectsModule.forRoot([ArticleEffect, LoginEffect]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      name: 'NgRx Demo App',
      logOnly: CONFIG.production,
    }),
  ],
  declarations: [],
  providers: [
    LocalStoreService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: LocalStoreService) => () => {
        ds.load();
      },
      deps: [LocalStoreService],
      multi: true,
    },
  ],
})
export class AppStoreModule {}
