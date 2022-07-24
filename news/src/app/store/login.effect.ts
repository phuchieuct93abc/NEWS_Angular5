import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';
import firebase from 'firebase/compat/app';
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
