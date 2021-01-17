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
    hasVideo: false;

    @Input()
    alt: string
    @ViewChild('image', { static: false })
    imageRef: ElementRef<HTMLImageElement>;
    @Input()
    parallax:boolean;


    onDestroy$ = new Subject<void>();



    convertedImagePath: string;

    constructor(private imageService: ImageSerice,) {

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


    }




    ngOnDestroy(): void {
        this.onDestroy$.next()
    }



}
