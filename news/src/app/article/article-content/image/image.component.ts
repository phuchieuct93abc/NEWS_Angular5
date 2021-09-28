import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ImageSerice } from '../../../shared/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  @Input()
  public src: string;
  @Input()
  public width: number;
  @Input()
  public height: number;

  public constructor(private imageService: ImageSerice, private elRef: ElementRef<HTMLElement>) {}

  public ngOnInit() {
    this.replaceImageFormat();
  }

  private replaceImageFormat() {
    const imageWidth = this.elRef.nativeElement.offsetWidth;
    this.src = this.imageService.getImage(this.src, imageWidth);
  }
}
