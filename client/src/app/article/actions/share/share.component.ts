import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ClipboardService} from 'ngx-clipboard';
import GetSocialMediaSiteLinks_WithShareLinks from './social-share-media';

@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.scss'],
    animations: [
        trigger('shareSites', [
            transition(':leave', [
                animate('0.5s', style({height: 0})),
            ]),
            transition(':enter', [
                style({height: 0}),
                animate('0.5s', style({height: '*'})),
            ]),


        ]),
    ],
})
export class ShareComponent implements OnInit {

    public isShowShareSites = false;

    public constructor(private clipboardService: ClipboardService, private matSnackBar: MatSnackBar) {
    }

    public ngOnInit() {
    }

    public share(provider: string) {

        const url = GetSocialMediaSiteLinks_WithShareLinks({
            url: window.location.href,
        });
        window.open(url[provider], '_blank');

    }

    public shareFaceBook() {
        this.share('facebook');
    }

    public shareSkype() {
        this.share('skype');
    }

    public sharePocket() {
        this.share('getpocket');

    }

    public shareEvernote() {
        this.share('evernote');

    }

    public copyUrl() {
        this.clipboardService.copyFromContent(window.location.href);
        this.snackBar.open('Copied link successful', null, {
            duration: 2000,
        });
    }
}
