import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

export class CustomGoogleLoginProvider {
  decodeJwt(idToken: string): unknown {
    return JSON.parse(window.atob(idToken.split('.')[1]));
  }
}
