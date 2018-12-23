import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import StoryImage from "../../../../../model/StoryImage";

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
    interval;

    constructor() {
    }

    ngOnInit() {
        const firstImage = this.images[0];
        this.imagePath = firstImage.imageUrl;
        this.randomImagePath();


        const width = this.imageViewer.nativeElement.offsetWidth;
        this.height = firstImage.height / firstImage.width * width;

    }

    private randomImagePath() {
        if (this.images.length > 1) {

            this.interval = setInterval(() => {

                const randomIndex = Math.floor(Math.random() * this.images.length);
                this.imagePath = this.images[randomIndex].imageUrl;
            }, 3000)
        }
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }


}
