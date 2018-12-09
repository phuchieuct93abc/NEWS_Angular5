import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    name = 'Angular';

    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
        this.http.get("http://localhost:3000").subscribe(res=>{
            console.log(res)
        })
    }

}
