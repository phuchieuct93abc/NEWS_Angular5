import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
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

    public isPlaying = false;

    public videoSrc$ = new BehaviorSubject<SafeResourceUrl>(null);

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.videoSrc$.next(this.parseUrl());
    }


    public parseUrl(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`javascript:window.location.replace("${this.url}")`);
    }

    public play(): void {
        this.isPlaying = true;
    }
}
