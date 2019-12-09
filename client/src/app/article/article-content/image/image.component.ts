import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ImageSerice} from "../../../shared/image.service";

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

    @Input()
    src: string;
    @Input()
    width: number;
    @Input()
    height: number;


    constructor(private imageService: ImageSerice, private elRef: ElementRef) {
    }

    ngOnInit() {
        this.replaceImageFormat();
    }

    private replaceImageFormat() {
        let imageWidth = (<HTMLElement>this.elRef.nativeElement).offsetWidth;

        this.src = this.imageService.getImage(this.src, imageWidth)
    }
}
