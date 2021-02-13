import { ElementRef, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import CONFIG from 'src/environments/environment';
import Article from '../../../../../model/Article';

@Component({
  selector: 'app-article-thumbnail',
  templateUrl: './article-thumbnail.component.html',
  styleUrls: ['./article-thumbnail.component.scss'],
})
export class ArticleThumbnailComponent implements OnInit {

  @Input()
  public thumbnailPath: string;
  @Input()
  public article: Article;
  @Input()
  public rootArticle: ElementRef<HTMLElement>;
  @ViewChild('articleHeader')
  protected articleHeader: ElementRef;

  public isStickHeader = false;

  private readonly thresholds = [0, 1];


  public constructor(private element: ElementRef<HTMLElement>) { }

  public ngOnInit() {
    if (!CONFIG.isRunningInNode) {
      this.registerStickyHeader();
    }
  }

  protected resetStickyHeader() {
    this.isStickHeader = false;
  }
  protected registerStickyHeader() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      return;
    };

    const options = {
      threshold: this.thresholds,
      root: this.rootArticle.nativeElement,
    };
    setTimeout(() => {

      const observer = new IntersectionObserver(([entry]) => {
        this.isStickHeader = !entry.isIntersecting && entry.intersectionRatio === 0;
        if (this.isStickHeader) {
          this.element.nativeElement.style.position = 'sticky';
          this.element.nativeElement.style.top = '0';
          observer.disconnect();
        }
      }, options);
      
      setTimeout(() => {
        observer.observe(this.articleHeader.nativeElement);

      }, 0);
    }, 500);
  }

}
