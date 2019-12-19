import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {Observable} from "rxjs";
import {StoryListService} from "../story-list/story-list.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {ImageSerice} from "../../shared/image.service";

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
    animations: [
        trigger('spinner', [
            transition(':leave', [
                style({opacity: 1}),
                animate("0.5s", style({opacity: 0}))])
        ])
    ]
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
    alt:string


    convertedImagePath: string;
    isLoading: boolean;


    readonly SMALL_IMAGE = 150;
    readonly BIG_IMAGE = 300;

    scrollObservable: Observable<any>;


    constructor(private config: ConfigService, private breakpointService: BreakpointDetectorService,
                private storyListService: StoryListService, private imageService: ImageSerice,
                private elRef: ElementRef
    ) {

    }


    ngOnInit() {
        if (this.imagePath) {

            let imageWidth = (<HTMLElement>this.elRef.nativeElement).offsetWidth;
            this.convertedImagePath = this.imageService.getImage(this.imagePath, imageWidth);
            this.scrollObservable = this.storyListService.onScroll;
            this.isLoading = true;
        } else {
            console.error("empty image path")
        }
    }

    //
    // getImage(imagePath: string) {
    //     if (imagePath.indexOf("baomoi") > 0) {
    //         let maxImageSize = this.config.getConfig().smallImage && this.breakpointService.isSmallScreen ? this.SMALL_IMAGE : this.BIG_IMAGE;
    //
    //         if (this.fullSize) {
    //             maxImageSize = this.width;
    //         }
    //         let result = imagePath;
    //
    //         result = result.replace(new RegExp(/\/w(\d)*/gm), '/w' + maxImageSize);
    //         const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    //         if (isChrome) {
    //             result = result + ".webp";
    //         }
    //         return result;
    //     }
    //
    //     return imagePath;
    // }

}
