import { Platform } from '@angular/cdk/platform';
import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { asyncScheduler, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { ImageSerice } from "../../shared/image.service";

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit, OnDestroy {

    @Input()
    imagePath: string;

    @Input()
    width: number;

    @Input()
    height: number;
    @Input()
    hasVideo: false;
    @Input()
    fullSize: false;
    @Input()
    wrapperWidth: number;
    @Input()
    alt: string

    isParallaxing: boolean;
    isStoppingParallax: boolean;


    private _parallax: boolean;
    public get parallax(): boolean {
        return this._parallax;
    }

    @Input()
    public set parallax(value: boolean) {
        if (value && !this._parallax) {
            this.startParallax();
        }
        if (!value) {
            this.stopParallax();
            this.deltaY = 0;

        }
        this._parallax = value;
    }

    startScrollY: number;
    deltaY = 0;
    scrollListener$: () => void = () => { };
    scroll$ = new Subject<void>();
    onDestroy$ = new Subject<void>();



    convertedImagePath: string;

    constructor(private imageService: ImageSerice, private elRef: ElementRef, private platform: Platform, private renderer2: Renderer2) {

    }

    ngOnInit() {
        if (this.imagePath) {
            setTimeout(() => {
                let imageWidth = window.innerWidth
                this.convertedImagePath = this.imageService.getImage(this.imagePath, imageWidth);
            }, 0);
        } else {
            console.error("empty image path")
        }

        this.scroll$.pipe(throttleTime(200, asyncScheduler, { leading: true, trailing: true }), takeUntil(this.onDestroy$)).subscribe(() => {
            this.deltaY = Math.max(0, Math.min(200, window.scrollY - this.startScrollY) / 2);

        })
    }

    startParallax() {
        setTimeout(() => {
            this.isParallaxing = true;
            this.startScrollY = window.scrollY;
            this.scrollListener$();
            this.scrollListener$ = this.renderer2.listen('window', 'scroll', (e) => this.scroll$.next());
        }, 1000);
    }
    stopParallax() {
        this.isStoppingParallax = true;
        this.scrollListener$();
        setTimeout(() => {
            this.isStoppingParallax = false;
            this.isParallaxing = false
        }, 1000);
    }


    ngOnDestroy(): void {
        this.scrollListener$();
        this.onDestroy$.next()
    }



}
