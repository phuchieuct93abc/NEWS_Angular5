import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalStorage, StorageMap } from '@ngx-pwa/local-storage';
import { filter, switchMap, take } from 'rxjs';
import { LocalStorageService } from '../shared/storage.service';
import { ArticleHistoryData, articleHistoryFeature, loadArticleHistorySuccess } from './article-history.feature';
import { GoogleLogin, loginFeature, loginSuccess } from './login.effect';

@Injectable()
export class LocalStoreService {
  constructor(private store: Store, private localStorageService: LocalStorageService) {}

  load(): void {
    this.store
      .select(loginFeature.selectLoginFeatureState)
      .pipe()
      .subscribe((login) => this.localStorageService.setItemSync('loggedUser', login));
    this.store
      .select(articleHistoryFeature.selectArticleHistoryState)
      .pipe(switchMap((articleHistory) => this.localStorageService.setItem('articleHistory', articleHistory)))
      .subscribe();

    this.localStorageService
      .getItem('loggedUser', null)
      .pipe(
        filter((a) => !!a),
        take(1)
      )
      .subscribe((loggedUser) => this.store.dispatch(loginSuccess(loggedUser as GoogleLogin)));
    this.localStorageService
      .getItem('articleHistory', null)
      .pipe(
        filter((a) => !!a),
        take(1)
      )

      .subscribe((articleHistory) => this.store.dispatch(loadArticleHistorySuccess(articleHistory as ArticleHistoryData)));
  }
}
