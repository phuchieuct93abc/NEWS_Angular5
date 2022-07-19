import { SocialUser, SocialAuthService } from '@abacritt/angularx-social-login';
import { state } from '@angular/animations';
import { Injectable, OnInit } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { createAction, createFeature, createReducer, on, props, Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class LoginEffect {
  user: SocialUser;
  loggedIn: boolean;

  constructor(private authService: SocialAuthService, store: Store) {
    this.authService.authState.subscribe((user) => {
      store.dispatch(loginSuccess({ user, loggedIn: user != null }));
    });
  }
}

export interface GoogleLogin {
  user: SocialUser;
  loggedIn: boolean;
}
const initialState: GoogleLogin = { loggedIn: false, user: null };
const loginSuccess = createAction('[Google login] Logic success', props<GoogleLogin>());
export const loginFeature = createFeature({
  name: 'LoginFeature',
  reducer: createReducer(
    initialState,
    on(loginSuccess, (state, action) => ({ ...state, ...action }))
  ),
});
