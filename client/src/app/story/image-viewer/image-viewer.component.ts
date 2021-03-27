import { stringify } from '@angular/compiler/src/util';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import { ImageSerice } from '../../shared/image.service';
import { IS_NODE } from './../../shared/const';

interface ImageViewerData { imagePath: string; width: number; height: number }

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

    public data$: Observable<ImageViewerData>;


    public onDestroy$ = new Subject<void>();


    public convertedImagePath$: Observable<string>;

    public constructor(private imageService: ImageSerice,
        private elRef: ElementRef<HTMLElement>,
        @Inject(IS_MOBILE) private isMobile: boolean,
        @Inject(IS_NODE) private isNode: boolean,
        private transferState: TransferState) {
    }

    public ngOnInit(): void {
        this.data$ = this.data$ = this.getImageData(this.imagePath).pipe(tap(data=>{
            if(this.isNode){
                const imageKey: StateKey<ImageViewerData> = makeStateKey<ImageViewerData>(`imageviewer-${this.imagePath}`);
                this.transferState.set(imageKey, data);
            }
        }));
    }


    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    private getImageData(image: string): Observable<ImageViewerData> {

        return new Observable(resolve=>{
            let width: number;
            let height: number;
            let imagePath = image;
                const imageKey: StateKey<ImageViewerData> = makeStateKey<ImageViewerData>(`imageviewer-${this.imagePath}`);

                if (this.transferState.hasKey(imageKey)) {
                    resolve.next(this.transferState.get<ImageViewerData>(imageKey, undefined));
                    return;
                }
                const resolution = new RegExp(/w\d*_r(\d*)x(\d*)/gm).exec(this.imagePath);
                if (resolution) {
                    width = parseInt(resolution[1], 10);
                    height = parseInt(resolution[2], 10);
                }
                if (this.isNode) {
                    if (this.imagePath.indexOf('photo-baomoi.zadn.vn') >= 0) {
                        imagePath = this.imagePath + '.webp';
                    }
                } else {
                    const imageWidth = this.isMobile ? window.innerWidth : this.elRef.nativeElement.offsetWidth;
                    imagePath = this.imageService.getImage(this.imagePath, imageWidth);
                }
                resolve.next({imagePath,width,height});
        });

    }

}
