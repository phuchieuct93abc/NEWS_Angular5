import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FIREBASE_CONFIG, FIREBASE_PUBLIC_KEY} from "../../../../model/firebase.config";
import * as firebaseApp from "firebase";
import {NotificationService} from "./notification.service";

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
            this.message = firebaseApp.messaging()

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
                console.log('Notification permission granted.');
                this.getToken();

            }
        ).catch(function (err) {
            console.log('Unable to get permission to notify.', err);
        });


        this.message.onMessage((payload) => {
                alert("get message");
                console.log('Message received. ', payload);
                // ...
            }
        )
        ;
    }


    private getToken() {
        this.message.getToken().then((currentToken) => {
            if (currentToken) {
                console.log(currentToken);
                this.notificationService.subscribeToken(currentToken);

            } else {
                console.log(`No token`);

            }
        }).catch(function (err) {
            console.log(`error ${err}`);

        });
    }

}
