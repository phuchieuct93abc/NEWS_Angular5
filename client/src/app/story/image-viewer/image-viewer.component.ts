import { Observable } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
    @ViewChild('image', { static: false })
    imageRef: ElementRef<HTMLImageElement>;

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
    requestId: any;

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

        this.scroll$.pipe(throttleTime(1000, asyncScheduler, { leading: true, trailing: true }), takeUntil(this.onDestroy$)).subscribe(() => {
            this.requestAnimation();

        })
    }
    private requestAnimation() {
      return this.updateAnimation();
         
    }
    private updateAnimation(startTimestamp?){
        return window.requestAnimationFrame((timestamp) => {
            if (startTimestamp === undefined)
                startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const deltaY = Math.max(0, Math.min(200, window.scrollY - this.startScrollY) / 2);
            this.imageRef.nativeElement.style.transform = `translateY(${deltaY}px)`;
            if (elapsed < 1000) { // Stop the animation after 2 seconds
                this.requestId = this.updateAnimation(startTimestamp);
            }
        })
    }

    startParallax() {
        setTimeout(() => {
            this.isParallaxing = true;
            this.startScrollY = window.scrollY;
            this.scrollListener$();
            this.scrollListener$ = this.renderer2.listen('window', 'scroll', (e) => this.scroll$.next());
            this.requestAnimation();

        }, 1000);
    }
    stopParallax() {
        this.isStoppingParallax = true;
        this.scrollListener$();
        setTimeout(() => {
            this.isStoppingParallax = false;
            this.isParallaxing = false;
            window.cancelAnimationFrame(this.requestId)

            
        }, 1000);
    }


    ngOnDestroy(): void {
        this.scrollListener$();
        this.onDestroy$.next()
    }



}
