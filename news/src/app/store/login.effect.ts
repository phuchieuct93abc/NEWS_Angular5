import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';
import { getArticleHistory } from './article-history.feature';
import { configFeature } from './config.reducer';

@Injectable({ providedIn: 'root' })
export class LoginEffect {
  user: SocialUser;
  loggedIn: boolean;

  constructor(private authService: SocialAuthService, store: Store<{ loggedUser: GoogleLogin }>) {
    this.authService.authState.subscribe((user) => {
      if (user) {
        store.dispatch(loginSuccess({ user, loggedIn: user != null }));
        store.dispatch(getArticleHistory());
      }
    });
  }
}

export interface GoogleLogin {
  user: SocialUser;
  loggedIn: boolean;
}
const initialState: GoogleLogin = { user: null, loggedIn: false };
export const loginSuccess = createAction('[Google login] Login success', props<GoogleLogin>());
export const loginReducer = createReducer(
  initialState,
  on(loginSuccess, (s, action) => ({ ...s, ...action }))
);
export const loginFeature = createFeature({
  name: 'LoginFeature',
  reducer: loginReducer,
});
