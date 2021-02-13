import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { IS_MOBILE } from 'src/app/shared/const';
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
    @ViewChild('image')
    public imageRef: ElementRef<HTMLImageElement>;
    @Input()
    public parallax: boolean;
    @Input()
    public maxParallax = 40;


    public onDestroy$ = new Subject<void>();


    public convertedImagePath: string;

    public width:number;
    public height:number;

    public constructor(private imageService: ImageSerice,
        private elRef: ElementRef<HTMLElement>,
        @Inject(IS_MOBILE) private isMobile: boolean) {
    }

    public ngOnInit() {
        this.refreshImageResolution();
    }


    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    private refreshImageResolution() {
        
        if (this.imagePath) {
           const resolution =  new RegExp(/w\d*_r(\d*)x(\d*)/gm).exec(this.imagePath);
            if(resolution){
                this.width = parseInt(resolution[1],10);
                this.height = parseInt(resolution[2],10);
            }
     
            setTimeout(() => {
                const imageWidth = this.isMobile ? window.innerWidth : this.elRef.nativeElement.offsetWidth;
                this.convertedImagePath = this.imageService.getImage(this.imagePath, imageWidth);
            });
        } else {
            console.error('empty image path');
        }
    }

}
