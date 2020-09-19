import { environment } from './../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: `root`
})
export class NotificationService {

    constructor(private httpClient: HttpClient) {


    }

    public subscribeToken(token) {

        this.httpClient.post(environment.baseUrl + "subscribe", {
            token: token,
            topic: "BaoHieu"
        }).subscribe(value=>{
        });
    }
}
