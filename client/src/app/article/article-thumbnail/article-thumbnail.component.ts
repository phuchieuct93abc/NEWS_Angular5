import { ElementRef, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import Article from '../../../../../model/Article';

@Component({
  selector: 'app-article-thumbnail',
  templateUrl: './article-thumbnail.component.html',
  styleUrls: ['./article-thumbnail.component.scss']
})
export class ArticleThumbnailComponent implements OnInit {
  readonly THRESHOLDS = [0,1];

  @Input()
  thumbnailPath: string;
  @Input()
  article: Article;
  @ViewChild('articleHeader', { static: false })
  protected articleHeader: ElementRef
  isStickHeader: boolean = false
  @Input()
  rootArticle: ElementRef<HTMLElement>;

  constructor(private element:ElementRef<HTMLElement>) { }

  ngOnInit() {
    this.registerStickyHeader();
  }

  protected resetStickyHeader() {
    this.isStickHeader = false;
  }
  protected registerStickyHeader() {
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) return;

    let options = {
      threshold: this.THRESHOLDS,
      root: this.rootArticle.nativeElement
    };
    setTimeout(() => {

      let observer = new IntersectionObserver(([entry], observer) => {
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
