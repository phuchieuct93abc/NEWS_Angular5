import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.http.get("http://localhost:3000").lift()
            .subscribe(res => {
            console.log(res)
        })
    }

}
