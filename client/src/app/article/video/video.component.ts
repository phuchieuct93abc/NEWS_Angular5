import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import RequestAnimationFrame from "../../requestAnimationFrame.cons";

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

    @ViewChild('videoComponent', {static: false})
    videoComponent: ElementRef;

    heightIframe: number;
    widthIframe: number;
    @ViewChild('videoFrame', {static: false})
    videoFrame: ElementRef;
    isPlaying = false;

    constructor(private _sanitizer: DomSanitizer, private breakpointDetector: BreakpointDetectorService) {
    }

    ngOnInit() {

        RequestAnimationFrame(() => {
            this.widthIframe = (<HTMLDivElement>this.videoComponent.nativeElement).clientWidth;
            this.heightIframe = this.height / this.width * this.widthIframe;

        })
    }

    parseUrl(): string {
        return `javascript:window.location.replace("${this.url}")`
    }


    play() {
        if (typeof window !== 'undefined') {

            this.isPlaying = true;
            this.videoFrame.nativeElement.setAttribute('src', this.parseUrl());
        }

    }
}
