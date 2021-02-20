import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { IS_MOBILE } from 'src/app/shared/const';
import { ImageSerice } from '../../shared/image.service';
import { IS_NODE } from './../../shared/const';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
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
    public maxParallax = 40;
    // @Input()
    // public responsive = false;


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

    public ngOnInit() {

        this.refreshImageResolution();
    }


    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    private refreshImageResolution() {

        if (this.imagePath) {
            const imageKey = makeStateKey<{imagePath: string;width: Number;height: number}>(`imageviewer-${this.imagePath}`);

            if(this.transferState.hasKey(imageKey)){
                const {imagePath,width,height}=this.transferState.get(imageKey, null);
                this.convertedImagePath = imagePath;
                this.height = height;
                this.width = width;
                return;
            }
           const resolution =  new RegExp(/w\d*_r(\d*)x(\d*)/gm).exec(this.imagePath);
            if(resolution){
                this.width = parseInt(resolution[1],10);
                this.height = parseInt(resolution[2],10);
            }
            if(this.isNode){
                this.convertedImagePath = this.imagePath+'.webp';
                this.transferState.set(imageKey,{
                    imagePath: this.convertedImagePath,
                    width: this.width,
                    height: this.height,
                });

            }else{
                setTimeout(() => {
                    const imageWidth = this.isMobile ? window.innerWidth : this.elRef.nativeElement.offsetWidth;
                    this.convertedImagePath = this.imageService.getImage(this.imagePath, imageWidth);
                });
            }


        } else {
            console.error('empty image path');
        }
    }

}
