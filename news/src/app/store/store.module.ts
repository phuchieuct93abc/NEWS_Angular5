import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';
import environment from 'src/environments/environment';
import { ArticleEffect, articleHistoryFeature } from './article-history.feature';

import { ConfigEffect, configFeature } from './config.reducer';
import { LocalStoreService } from './local-store.service';
import { LoginEffect } from './login.effect';
import { StoryEffect, storyFeature } from './story.reducer';

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
    StoreModule.forFeature(articleHistoryFeature),
    StoreModule.forFeature(storyFeature),
    EffectsModule.forRoot([ArticleEffect, LoginEffect, StoryEffect, ConfigEffect]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      name: 'NgRx Demo App',
      logOnly: environment.production,
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
