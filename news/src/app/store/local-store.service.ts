import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable, switchMap, take, tap } from 'rxjs';
import { LocalStorageService } from '../shared/storage.service';
import { ArticleHistoryData, articleHistoryFeature, loadArticleHistorySuccess } from './article-history.feature';
import { Config, initialConfigState, updateConfigAction } from './config.reducer';

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
  }

  load(): void {
    this.loadArticleHistory.pipe(switchMap(() => this.storeArticleHistory)).subscribe();
    this.localStorageService
      .getItem<Config>('config', initialConfigState)
      .pipe(take(1))
      .subscribe((config) => this.store.dispatch(updateConfigAction(config)));
  }
}
