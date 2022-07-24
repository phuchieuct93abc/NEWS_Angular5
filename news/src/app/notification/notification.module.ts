/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
import { FIREBASE_CONFIG, FIREBASE_PUBLIC_KEY } from '../../../../model/firebase.config';
import { IS_NODE } from './../shared/const';
import { NotificationService } from './notification.service';
@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class NotificationModule {
  public message: Messaging;
  private readonly numberOfNavigationBeforeNotification = 5;
  private numberOfNavigation = 0;
  private stopRegisterNotification$ = new Subject<void>();
  private firebaseApp: FirebaseApp;
  public constructor(private router: Router, private notificationService: NotificationService, @Inject(IS_NODE) private isNode: boolean) {
    if (this.isNode) {
      return;
    }
    try {
      // this.firebaseApp = initializeApp(FIREBASE_CONFIG);
      this.registerNotification();
    } catch (e) {
      console.error(e);
    }
  }

  public registerNotification(): void {
    this.router.events.pipe(takeUntil(this.stopRegisterNotification$)).subscribe((event) => {
      if (typeof window !== 'undefined') {
        if (event instanceof NavigationEnd) {
          if (++this.numberOfNavigation < this.numberOfNavigationBeforeNotification) {
            return;
          }
          this.message = getMessaging();
          getToken(this.message, { vapidKey: FIREBASE_PUBLIC_KEY })
            .then((currentToken) => {
              if (currentToken) {
                console.log('token', currentToken);
                this.notificationService.subscribeToken(currentToken);
              } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
                // ...
              }
            })
            .catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
              // ...
            });

          this.stopRegisterNotification$.next();
        }
      }
    });
  }
}
