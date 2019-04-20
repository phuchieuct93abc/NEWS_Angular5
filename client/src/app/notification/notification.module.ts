import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FIREBASE_CONFIG, FIREBASE_PUBLIC_KEY} from "./firebase.config";
import * as firebase from "firebase";

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ]
})
export class NotificationModule {
    message: firebase.messaging.Messaging;

    constructor() {
        const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        this.message = firebaseApp.messaging()

    }

    initFirebase() {

        this.message.usePublicVapidKey(FIREBASE_PUBLIC_KEY);
        this.message.requestPermission().then(function () {
            console.log('Notification permission granted.');


        }).catch(function (err) {
            console.log('Unable to get permission to notify.', err);
        });

        this.getToken();
        this.message.onMessage(function (payload) {
            alert("get message");
            console.log('Message received. ', payload);
            // ...
        });
    }

    private getToken() {
        this.message.getToken().then(function (currentToken) {
            if (currentToken) {
                console.log(currentToken);
            } else {
                console.log(`No token`);

            }
        }).catch(function (err) {
            console.log(`error ${err}`);

        });
    }

}
