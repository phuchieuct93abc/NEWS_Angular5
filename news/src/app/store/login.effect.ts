import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { getArticleHistory } from './article-history.feature';

@Injectable({ providedIn: 'root' })
export class LoginEffect {
  constructor(auth: AngularFireAuth, store: Store) {
    auth.authState.subscribe((user) => {
      if (user) {
        store.dispatch(getArticleHistory());
      }
    });
  }
}
