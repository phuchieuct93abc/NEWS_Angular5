import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ImageSerice } from "../../shared/image.service";

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

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
    @Input()
    scrollElement:Element;


    convertedImagePath: string;

    constructor(private imageService: ImageSerice, private elRef: ElementRef) {

    }


    ngOnInit() {
        if (this.imagePath) {
            setTimeout(() => {
                let imageWidth = (<HTMLElement>this.elRef.nativeElement).offsetWidth;
                this.convertedImagePath = this.imageService.getImage(this.imagePath, imageWidth);
            }, 0);
        } else {
            console.error("empty image path")
        }
    }

}
