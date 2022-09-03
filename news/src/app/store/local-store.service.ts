import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { IS_MOBILE } from '../shared/const';
import { LocalStorageService } from '../shared/storage.service';
import { ArticleHistoryData, articleHistoryFeature, loadArticleHistorySuccess } from './article-history.feature';
import { Config, initialConfigState, Theme, updateConfigAction } from './config.reducer';

@Injectable()
export class LocalStoreService {
  private loadArticleHistory: Observable<unknown>;
  private storeArticleHistory: Observable<unknown>;
  constructor(private store: Store, private localStorageService: LocalStorageService, @Inject(IS_MOBILE) public isSmallScreen: boolean) {
    this.loadArticleHistory = this.localStorageService
      .getItem('articleHistory', null)
      .pipe(tap((articleHistory) => articleHistory && this.store.dispatch(loadArticleHistorySuccess(articleHistory as ArticleHistoryData))));

    this.storeArticleHistory = this.store.select(articleHistoryFeature.selectArticleHistoryState).pipe(
      filter((a) => !!a),
      switchMap((articleHistory) => this.localStorageService.setItem('articleHistory', articleHistory))
    );
  }

  load(): void {
    this.loadArticleHistory.pipe(switchMap(() => this.storeArticleHistory)).subscribe();
    this.localStorageService
      .getItem<Config>('config', { ...initialConfigState, theme: Theme.PREFERENCE })
      .pipe(
        take(1),
        map((config) => {
          if (config.theme == null) {
            return { ...config, theme: Theme.PREFERENCE };
          }
          return config;
        })
      )
      .subscribe((config) => this.store.dispatch(updateConfigAction(config)));
  }
}
