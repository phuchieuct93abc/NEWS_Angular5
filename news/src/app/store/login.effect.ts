import { SocialUser, SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable, OnInit } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginEffect {
  user: SocialUser;
  loggedIn: boolean;

  constructor(private authService: SocialAuthService) {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      this.user = user;
      this.loggedIn = user != null;
    });
  }
}
