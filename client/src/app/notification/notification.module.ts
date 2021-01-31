import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as firebaseApp from 'firebase/app';
import { FIREBASE_CONFIG, FIREBASE_PUBLIC_KEY } from '../../../../model/firebase.config';
import { NotificationService } from './notification.service';
import 'firebase/messaging';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
})
export class NotificationModule {
    public message: any;
    private readonly numberOfNavigationBeforeNotification = 5;
    private numberOfNavigation: 0;
    private stopRegisterNotification$ = new Subject<void>();
    public constructor(private router: Router, private notificationService: NotificationService) {
        try {
            firebaseApp.initializeApp(FIREBASE_CONFIG);
            this.registerNotification();


        } catch (e) {
            console.error(e);
        }

    }

    public registerNotification() {
        this.router.events.pipe(takeUntil(this.stopRegisterNotification$)).subscribe((event) => {
            if (typeof window !== 'undefined') {
                if (++this.numberOfNavigation < this.numberOfNavigationBeforeNotification) {
                    return;
                }
                if (event instanceof NavigationEnd) {
                    this.message = firebaseApp.messaging();
                    this.message.usePublicVapidKey(FIREBASE_PUBLIC_KEY);
                    this.message.requestPermission().then(() => this.getToken());
                    this.message.onTokenRefresh(() => this.getToken());
                    this.stopRegisterNotification$.next();
                }
            }
        });
    }


    private getToken() {
        this.message.getToken().then((currentToken) => {
            if (currentToken) {
                this.notificationService.subscribeToken(currentToken);
            }
        });
    }

}
