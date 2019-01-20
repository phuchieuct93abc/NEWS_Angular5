import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    @Input()
    url: string;

    @Input()
    poster: string;
    @Input()
    width: number;
    @Input()
    height: number;

    safeUrl: SafeResourceUrl;
    playVideo = false;

    @ViewChild('videoComponent')
    videoComponent: ElementRef;

    heightIframe: number;
    widthIframe: number;
    @ViewChild('videoFrame')
    videoFrame: ElementRef;

    constructor(private _sanitizer: DomSanitizer, private breakpointDetector: BreakpointDetectorService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.widthIframe = (<HTMLDivElement>this.videoComponent.nativeElement).clientWidth;
            this.heightIframe = this.height / this.width * this.widthIframe;
            this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.parseUrl());
        })
    }

    play() {
        this.playVideo = true;

    }

    parseUrl(): string {
        const mode = this.breakpointDetector.isSmallScreen ? 'mobile-video' : 'desktop-video';

        return `https://m.baomoi.com/player.epi#${this.url}|${mode}|${this.poster}|0|
        Hiện trường lửa cháy ngùn ngụt, người bị cháy đen do nổ đường ống ở Mexico - Báo Tin Tức TTXVN|
        ${this.widthIframe}|${this.heightIframe}|
        an-ninh-trat-tu|29404726|vf0|true|
        https://m.baomoi.com/hien-truong-lua-chay-ngun-ngut-nguoi-bi-chay-den-do-no-duong-ong-o-mexico/c/29404726.epi`
    }


}
