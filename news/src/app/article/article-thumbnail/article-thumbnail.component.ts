import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef, Inject, NgZone, ChangeDetectorRef, Input } from '@angular/core';
import Article from '../../../../../model/Article';
import { IS_NODE } from './../../shared/const';

@Component({
  selector: 'app-article-thumbnail',
  templateUrl: './article-thumbnail.component.html',
  styleUrls: ['./article-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sticky', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms', style({ opacity: 1 }))]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          '200ms',
          style({
            opacity: 0,
            transform: 'translateY(-100px)',
          })
        ),
      ]),
    ]),
  ],
})
export class ArticleThumbnailComponent implements AfterViewInit {
  @Input()
  public thumbnailPath: string;

  @Input()
  public rootArticle: HTMLElement;

  @Input()
  public header: string;

  @ViewChild('articleHeader')
  protected articleHeader: ElementRef;

  public isStickyHeader: boolean;

  private readonly thresholds = [0, 1];

  public constructor(@Inject(IS_NODE) private isNode: boolean, private zone: NgZone, private changeDetect: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (!this.isNode) {
      const options = {
        threshold: this.thresholds,
        root: this.rootArticle,
      };
      const observer = new IntersectionObserver(([entry]) => {
        this.isStickyHeader = !entry.isIntersecting && entry.intersectionRatio === 0;
        this.changeDetect.detectChanges();
      }, options);

      observer.observe(this.articleHeader.nativeElement);
    }
  }
}
