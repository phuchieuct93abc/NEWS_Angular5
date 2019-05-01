import {Component, OnInit} from '@angular/core';
import GetSocialMediaSiteLinks_WithShareLinks from "./social-share-media";

@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    share() {
        let url = GetSocialMediaSiteLinks_WithShareLinks({
            url: window.location.href
        })
        window.open(url['facebook'], "_blank");

    }
}
