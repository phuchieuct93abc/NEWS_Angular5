import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FIREBASE_CONFIG, FIREBASE_PUBLIC_KEY} from "../../../../model/firebase.config";
import * as firebaseApp from "firebase/app";
import {NotificationService} from "./notification.service";
import "firebase/messaging"

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ]
})
export class NotificationModule {
    message: any;

    constructor(private notificationService: NotificationService) {
        try {
            firebaseApp.initializeApp(FIREBASE_CONFIG);
            this.message = firebaseApp.messaging();
            this.initFirebase();
            this.message.onTokenRefresh(() => {
                this.getToken();
            });
        } catch (e) {
            console.error(e);
        }

    }

    initFirebase() {

        this.message.usePublicVapidKey(FIREBASE_PUBLIC_KEY);
        this.message.requestPermission().then(() => {
            this.getToken();
        })
    }


    private getToken() {
        this.message.getToken().then((currentToken) => {
            if (currentToken) {
                this.notificationService.subscribeToken(currentToken);
            }
        });
    }

}
