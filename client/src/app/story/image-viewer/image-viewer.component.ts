import { Component, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { IS_MOBILE } from 'src/app/shared/const';
import { ImageSerice } from '../../shared/image.service';
import { IS_NODE } from './../../shared/const';

interface CacheImageViewer { imagePath: string; width: number; height: number }

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit, OnDestroy {

    @Input()
    public imagePath: string;

    @Input()
    public hasVideo = false;

    @Input()
    public alt: string;
    @Input()
    public parallax: boolean;
    @Input()
    public maxParallax = 60;
    @Input()
    public startOffsetParllax = undefined;


    public onDestroy$ = new Subject<void>();


    public convertedImagePath: string;

    public width: number;
    public height: number;

    public constructor(private imageService: ImageSerice,
        private elRef: ElementRef<HTMLElement>,
        @Inject(IS_MOBILE) private isMobile: boolean,
        @Inject(IS_NODE) private isNode: boolean,
        private transferState: TransferState) {
    }

    public ngOnInit(): void {
        this.refreshImageResolution();
    }


    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    private refreshImageResolution() {

        if (this.imagePath) {
            const imageKey: StateKey<CacheImageViewer> = makeStateKey<CacheImageViewer>(`imageviewer-${this.imagePath}`);

            if (this.transferState.hasKey(imageKey)) {
                this.getFromCache(imageKey);
                return;
            }
            const resolution = new RegExp(/w\d*_r(\d*)x(\d*)/gm).exec(this.imagePath);
            if (resolution) {
                this.width = parseInt(resolution[1], 10);
                this.height = parseInt(resolution[2], 10);
            }
            if (this.isNode) {
                if (this.imagePath.indexOf('photo-baomoi.zadn.vn') >= 0) {
                    this.convertedImagePath = this.imagePath + '.webp';
                } else {
                    this.convertedImagePath = this.imagePath;
                }
                this.transferState.set(imageKey, {
                    imagePath: this.convertedImagePath,
                    width: this.width,
                    height: this.height
                });

            } else {
                setTimeout(() => {
                    const imageWidth = this.isMobile ? window.innerWidth : this.elRef.nativeElement.offsetWidth;
                    this.convertedImagePath = this.imageService.getImage(this.imagePath, imageWidth);
                });
            }
        } else {
            console.error('empty image path');
        }
    }


    private getFromCache(imageKey: StateKey<CacheImageViewer>) {
        const { imagePath, width, height } = this.transferState.get<CacheImageViewer>(imageKey, undefined);
        this.convertedImagePath = imagePath;
        this.height = height;
        this.width = width;
    }
}
