/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CommonModule } from '@angular/common';
import { Inject, NgModule } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { NavigationEnd, Router } from '@angular/router';
import { FirebaseApp } from 'firebase/app';
import { Messaging } from 'firebase/messaging';
import { Subject } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
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
  public constructor(
    private afMessaging: AngularFireMessaging,
    private router: Router,
    private notificationService: NotificationService,
    @Inject(IS_NODE) private isNode: boolean
  ) {
    if (this.isNode) {
      return;
    }
    try {
      this.registerNotification();
    } catch (e) {
      console.error(e);
    }
  }

  public registerNotification(): void {
    if (typeof window == undefined) {
      return;
    }
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter(() => ++this.numberOfNavigation > this.numberOfNavigationBeforeNotification),
        take(1),
        switchMap(() => this.afMessaging.requestToken)
      )
      .subscribe((token) => {
        if (token) {
          this.notificationService.subscribeToken(token);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      });
  }
}
