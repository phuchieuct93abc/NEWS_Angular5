import { BreakpointDetectorService } from './../../shared/breakpoint.service';
import { Platform } from '@angular/cdk/platform';
import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { asyncScheduler, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { ImageSerice } from '../../shared/image.service';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit, OnDestroy {

    @Input()
    public imagePath: string;

    @Input()
    public hasVideo: false;

    @Input()
    public alt: string;
    @ViewChild('image', { static: false })
    public imageRef: ElementRef<HTMLImageElement>;
    @Input()
    public parallax: boolean;
    @Input()
    public maxParallax = 40;


    public onDestroy$ = new Subject<void>();


    public convertedImagePath: string;
    private isMobile;

    public constructor(private imageService: ImageSerice,
        private elRef: ElementRef<HTMLElement>,
        breakpointService: BreakpointDetectorService) {
        this.isMobile = breakpointService.isSmallScreen;
    }

    public ngOnInit() {
        this.refreshImageResolution();
    }


    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    private refreshImageResolution() {
        if (this.imagePath) {
            setTimeout(() => {
                const imageWidth = this.isMobile ? window.innerWidth : this.elRef.nativeElement.offsetWidth;
                this.convertedImagePath = this.imageService.getImage(this.imagePath, imageWidth);
            });
        } else {
            console.error('empty image path');
        }
    }

}
