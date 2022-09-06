import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import environment from 'src/environments/environment';
import { ArticleEffect, articleHistoryFeature } from './article-history.feature';

import { ConfigEffect, configFeature } from './config.reducer';
import { LoginEffect } from './login.effect';
import { StoryEffect, storyFeature } from './story.reducer';

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
  providers: [],
})
export class AppStoreModule {}
