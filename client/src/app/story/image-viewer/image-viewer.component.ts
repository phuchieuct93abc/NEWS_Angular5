import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, HostListener } from '@angular/core';
import { ImageSerice } from "../../shared/image.service";

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
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
    parallax:boolean;

    startScrollY: number;
    deltaY:number;



    convertedImagePath: string;

    constructor(private imageService: ImageSerice, private elRef: ElementRef, private platform: Platform) {

    }

    startParallax() {
        this.startScrollY = window.scrollY;
    }

    // @HostListener('window:scroll', ['$event']) // for window scroll events
    // onScroll(event) {
    //     this.deltaY = Math.max(0,Math.min(100,window.scrollY - this.startScrollY)/2);
    // }


    ngOnInit() {
        if (this.imagePath) {
            setTimeout(() => {
                let imageWidth = window.innerWidth//(<HTMLElement>this.elRef.nativeElement).offsetWidth;
                this.convertedImagePath = this.imageService.getImage(this.imagePath, imageWidth);
            }, 0);
        } else {
            console.error("empty image path")
        }
    }

}
