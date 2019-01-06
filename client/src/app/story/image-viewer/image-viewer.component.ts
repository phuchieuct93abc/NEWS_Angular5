import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
    private imageIndex = 0;


    constructor(private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        const firstImage = this.images[0];
        this.imagePath = firstImage.imageUrl;
        this.calculateImageHeight(firstImage);
        this.randomImagePath();
    }

    private calculateImageHeight(firstImage) {
        const width = this.imageViewer.nativeElement.offsetWidth;
        this.height = firstImage.height / firstImage.width * width;
    }

    private randomImagePath() {
        if (this.images.length > 1) {

            this.interval = setInterval(() => {
                this.imageIndex++;
                if (this.imageIndex == this.images.length) {
                    this.imageIndex = 0;
                }
                this.imagePath = this.images[this.imageIndex].imageUrl;
            }, 3000)
        } else {
            this.detach();
        }
    }

    private detach() {
        setTimeout(()=>this.ref.detach())
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }


}
