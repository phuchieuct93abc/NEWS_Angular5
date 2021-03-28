import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as firebaseApp from 'firebase/app';
import { FIREBASE_CONFIG, FIREBASE_PUBLIC_KEY } from '../../../../model/firebase.config';
import { IS_NODE } from './../shared/const';
import { NotificationService } from './notification.service';
import 'firebase/messaging';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ]
})
export class NotificationModule {
    public message: any;
    private readonly numberOfNavigationBeforeNotification = 5;
    private numberOfNavigation = 0;
    private stopRegisterNotification$ = new Subject<void>();
    public constructor(private router: Router, private notificationService: NotificationService, @Inject(IS_NODE) private isNode: boolean) {
       if(this.isNode){
           return;
       }
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
                if (event instanceof NavigationEnd) {
                    if (++this.numberOfNavigation < this.numberOfNavigationBeforeNotification) {
                        return;
                    }
                    this.message = firebaseApp.messaging();
                    this.message.usePublicVapidKey(FIREBASE_PUBLIC_KEY);
                    this.message.requestPermission().then(() => this.getToken(),(e)=>console.log(e));
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
