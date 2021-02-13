import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {

    @Input()
    public url: string;

    @Input()
    public poster: string;
    @Input()
    public width: number;
    @Input()
    public height: number;

    @ViewChild('videoComponent')
    public videoComponent: ElementRef;

    @ViewChild('videoFrame')
    public videoFrame: ElementRef<HTMLDivElement>;
    public isPlaying = false;
    public heightIframe: number;
    public widthIframe: number;


    public ngOnInit() {

        setTimeout(() => {
            this.widthIframe = this.videoComponent.nativeElement.clientWidth;
            this.heightIframe = this.height / this.width * this.widthIframe;
        }, 100);
    }

    public parseUrl(): string {
        return `javascript:window.location.replace("${this.url}")`;
    }


    public play() {
        if (typeof window !== 'undefined') {

            this.isPlaying = true;
            this.videoFrame.nativeElement.setAttribute('src', this.parseUrl());
        }

    }
}
