import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import CONFIG from "../../../environments/environment";
import { MatSidenav } from "@angular/material/sidenav";

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

    @ViewChild('videoComponent',{static:false})
    videoComponent: ElementRef;

    heightIframe: number;
    widthIframe: number;
    @ViewChild('videoFrame',{static:false})
    videoFrame: ElementRef;
    isPlaying = false;

    constructor(private _sanitizer: DomSanitizer, private breakpointDetector: BreakpointDetectorService) {
    }

    ngOnInit() {

        requestAnimationFrame(() => {
            this.widthIframe = (<HTMLDivElement>this.videoComponent.nativeElement).clientWidth;
            this.heightIframe = this.height / this.width * this.widthIframe;

        })
    }

    parseUrl(): string {
        const mode = this.breakpointDetector.isSmallScreen ? 'mobile-video' : 'desktop-video';

    return `javascript:window.location.replace("${this.url}")`
        //return CONFIG.baseUrl + "proxy?url="+this.url;
        // return `https://m.baomoi.com/player.epi#${this.url}|${mode}|${this.poster}|0|
        // Hiện trường lửa cháy ngùn ngụt, người bị cháy đen do nổ đường ống ở Mexico - Báo Tin Tức TTXVN|
        // ${this.widthIframe}|${this.heightIframe}|
        // an-ninh-trat-tu|29404726|vf0|true|
        // https://m.baomoi.com/hien-truong-lua-chay-ngun-ngut-nguoi-bi-chay-den-do-no-duong-ong-o-mexico/c/29404726.epi`
    }


    play() {
        if(typeof window !== 'undefined'){

            this.isPlaying = true;
            this.videoFrame.nativeElement.setAttribute('src',this.parseUrl());
        }

    }
}
