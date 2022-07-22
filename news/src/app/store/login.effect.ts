import { SocialUser, SocialAuthService } from '@abacritt/angularx-social-login';
import { state } from '@angular/animations';
import { Injectable, OnInit } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';
import { configFeature } from './config.reducer';

@Injectable({ providedIn: 'root' })
export class LoginEffect {
  user: SocialUser;
  loggedIn: boolean;

  constructor(private authService: SocialAuthService, store: Store) {
    store.select(configFeature.selectFontSize).subscribe((a) => console.log('config', a));
    store.select(loginFeature.selectUser).subscribe((a) => console.log('login', a));
    this.authService.authState.subscribe((user) => {
      if (user) {
        store.dispatch(loginSuccess({ user, loggedIn: user != null }));
      }
    });
  }
}

export interface GoogleLogin {
  user: SocialUser;
  loggedIn: boolean;
}
const initialState: GoogleLogin = { user: null, loggedIn: false };
const loginSuccess = createAction('[Google login] Login success', props<GoogleLogin>());
export const loginReducer = createReducer(
  initialState,
  on(loginSuccess, (s, action) => ({ ...s, ...action }))
);
export const loginFeature = createFeature({
  name: 'LoginFeature',
  reducer: loginReducer,
});
