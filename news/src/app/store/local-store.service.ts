import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { LocalStorageService } from '../shared/storage.service';
import { ArticleHistoryData, articleHistoryFeature, loadArticleHistorySuccess } from './article-history.feature';
import { Config, configFeature, updateConfigAction } from './config.reducer';

@Injectable()
export class LocalStoreService {
  private loadArticleHistory: Observable<unknown>;
  private storeArticleHistory: Observable<unknown>;
  private storeConfig: Observable<unknown>;
  constructor(private store: Store, private localStorageService: LocalStorageService) {
    this.loadArticleHistory = this.localStorageService
      .getItem('articleHistory', null)
      .pipe(tap((articleHistory) => articleHistory && this.store.dispatch(loadArticleHistorySuccess(articleHistory as ArticleHistoryData))));

    this.storeArticleHistory = this.store.select(articleHistoryFeature.selectArticleHistoryState).pipe(
      filter((a) => !!a),
      switchMap((articleHistory) => this.localStorageService.setItem('articleHistory', articleHistory))
    );

    this.storeConfig = this.store.select(configFeature.selectConfigState).pipe(
      filter((a) => !!a),
      switchMap((config) => this.localStorageService.setItem('config', config))
    );
  }

  load(): void {
    this.loadArticleHistory.pipe(switchMap(() => this.storeArticleHistory)).subscribe();
    this.localStorageService
      .getItem<Config>('config', null)
      .pipe(
        filter((a) => !!a),
        take(1),
        tap((config) => this.store.dispatch(updateConfigAction(config))),
        switchMap(() => this.storeConfig)
      )
      .subscribe();
  }
}
