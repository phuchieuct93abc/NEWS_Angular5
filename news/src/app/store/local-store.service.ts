import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalStorage, StorageMap } from '@ngx-pwa/local-storage';
import { concatMap, filter, merge, mergeMap, Observable, switchMap, take, tap } from 'rxjs';
import { LocalStorageService } from '../shared/storage.service';
import { ArticleHistoryData, articleHistoryFeature, loadArticleHistorySuccess } from './article-history.feature';
import { GoogleLogin, loginFeature, loginSuccess } from './login.effect';

@Injectable()
export class LocalStoreService {
  private loadArticleHistory: Observable<unknown>;
  private storeLoggedUser: Observable<unknown>;
  private storeArticleHistory: Observable<unknown>;
  constructor(private store: Store, private localStorageService: LocalStorageService) {
    this.loadArticleHistory = this.localStorageService
      .getItem('articleHistory', null)
      .pipe(tap((articleHistory) => articleHistory && this.store.dispatch(loadArticleHistorySuccess(articleHistory as ArticleHistoryData))));

    this.storeLoggedUser = this.store.select(loginFeature.selectLoginFeatureState).pipe(
      filter((a) => !!a),
      tap((user) => {
        this.localStorageService.setItemSync('loggedUser', user);
      })
    );
    this.storeArticleHistory = this.store.select(articleHistoryFeature.selectArticleHistoryState).pipe(
      filter((a) => !!a),
      switchMap((articleHistory) => this.localStorageService.setItem('articleHistory', articleHistory))
    );
  }

  load(): void {
    this.loadArticleHistory.pipe(switchMap(() => this.storeArticleHistory)).subscribe();
  }
}
