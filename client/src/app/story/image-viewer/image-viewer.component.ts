import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {Observable} from "rxjs";
import {StoryListService} from "../story-list/story-list.service";
import {animate, style, transition, trigger} from "@angular/animations";

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
    diameter = 50;
    @Input()
    isUseSpinner = false;


    convertedImagePath: string;
    interval;
    isLoading = true;

    private maxImageSize: number;

    readonly SMALL_IMAGE = 100;
    readonly BIG_IMAGE = 300;

    scrollObservable: Observable<any>;


    constructor(private config: ConfigService, private ref: ChangeDetectorRef, private breakpointService: BreakpointDetectorService,
                private storyListService: StoryListService) {

    }

    onLoad(event: Event) {
        this.isLoading = false;
    }

    ngOnInit() {
        if (this.imagePath) {

            this.convertedImagePath = this.getImage(this.imagePath);
            this.scrollObservable = this.storyListService.onScroll;
        } else {
            console.error("empty image path")
        }
    }


    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    getImage(imagePath: string) {
        if (imagePath.indexOf("baomoi") > 0) {
            this.maxImageSize = this.config.getConfig().smallImage && this.breakpointService.isSmallScreen ? this.SMALL_IMAGE : this.BIG_IMAGE;

            if (this.fullSize) {
                this.maxImageSize = this.width;
            }
            let result = imagePath;

            result = result.replace(new RegExp(/\/w(\d)*/gm), '/w' + this.maxImageSize);
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
            if (isChrome) {
                result = result + ".webp";
            }
            return result;
        }

        return imagePath;
    }

}
