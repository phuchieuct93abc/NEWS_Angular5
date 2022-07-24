import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';
import firebase from 'firebase/compat/app';
import { getArticleHistory } from './article-history.feature';

@Injectable({ providedIn: 'root' })
export class LoginEffect {
  user: firebase.User;
  loggedIn: boolean;

  constructor(private auth: AngularFireAuth, store: Store) {
    auth.authState.subscribe((user) => {
      if (user) {
        console.log(user);
        store.dispatch(getArticleHistory());
      }
    });
  }
}

export interface GoogleLogin {
  user: firebase.User;
  loggedIn: boolean;
}
const initialState: GoogleLogin = { user: null, loggedIn: false };
export const loginSuccess = createAction('[Google login] Login success', props<GoogleLogin>());
export const logout = createAction('[Google login] Logout');
export const loginReducer = createReducer(
  initialState,
  on(loginSuccess, (s, action) => action),
  on(logout, () => ({ ...initialState }))
);
export const loginFeature = createFeature({
  name: 'LoginFeature',
  reducer: loginReducer,
});
