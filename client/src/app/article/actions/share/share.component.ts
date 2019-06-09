import {Component, OnInit} from '@angular/core';
import GetSocialMediaSiteLinks_WithShareLinks from "./social-share-media";
import {animate, style, transition, trigger} from "@angular/animations";
import {ClipboardService} from "ngx-clipboard";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.scss'],
    animations: [
        trigger("shareSites", [
            transition(":leave", [
                animate("0.5s", style({height: 0}))
            ]),
            transition(":enter", [
                style({height: 0}),
                animate("0.5s", style({height: '*'}))
            ])


        ])
    ]
})
export class ShareComponent implements OnInit {

    isShowShareSites = false;

    constructor(private _clipboardService: ClipboardService,private snackBar: MatSnackBar) {
    }

    ngOnInit() {
    }

    share(provider: string) {

        let url = GetSocialMediaSiteLinks_WithShareLinks({
            url: window.location.href
        })
        window.open(url[provider], "_blank");

    }

    shareFaceBook() {
        this.share("facebook")
    }

    shareSkype() {
        this.share("skype")
    }

    sharePocket() {
        this.share("getpocket")

    }

    shareEvernote() {
        this.share("evernote")

    }

    copyUrl() {
        this._clipboardService.copyFromContent(window.location.href)
        this.snackBar.open("Copied link successful", null, {
            duration: 2000,
        });
    }
}
