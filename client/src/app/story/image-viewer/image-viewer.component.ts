import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import StoryImage from "../../../../../model/StoryImage";
import {ConfigService} from "../../shared/config.service";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {Observable} from "rxjs";
import {StoryListService} from "../story-list/story-list.service";

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit, OnDestroy {

    @Input()
    images: StoryImage[];
    @Input()
    hasVideo: boolean;
    imagePath: string;
    height: number = 0;
    @ViewChild("imageViewer")
    imageViewer: ElementRef;
    convertedImagePath: string;
    interval;
    private imageIndex = 0;

    private maxImageSize: number;

    readonly SMALL_IMAGE = 100;
    readonly BIG_IMAGE = 300;

    scrollObservable: Observable<any>;

    constructor(private config: ConfigService, private ref: ChangeDetectorRef, private breakpointService: BreakpointDetectorService,
                private storyListService: StoryListService) {

    }

    ngOnInit() {
        const firstImage = this.images[0];
        this.imagePath = firstImage.imageUrl;
        this.calculateImageHeight(firstImage);
        this.convertedImagePath = this.getImage(this.imagePath);
        this.scrollObservable = this.storyListService.onScroll;
    }


    private calculateImageHeight(firstImage) {
        const width = this.imageViewer.nativeElement.offsetWidth;
        this.height = firstImage.height / firstImage.width * width;
    }


    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    getImage(imagePath: string) {
        if (imagePath.indexOf("baomoi") > 0) {
            this.maxImageSize = this.config.getConfig().smallImage && this.breakpointService.isSmallScreen ? this.SMALL_IMAGE : this.BIG_IMAGE;

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
