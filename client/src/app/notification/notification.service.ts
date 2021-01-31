import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import CONFIG from "../../environments/environment";

@Injectable({
    providedIn: `root`
})
export class NotificationService {

    public constructor(private httpClient: HttpClient) {


    }

    public subscribeToken(token) {

        this.httpClient.post(CONFIG.baseUrl + "subscribe", {
            token: token,
            topic: "BaoHieu"
        }).subscribe(value=>{
        });
    }
}
