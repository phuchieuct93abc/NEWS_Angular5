import { ElementRef, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import Article from '../../../../../model/Article';

@Component({
  selector: 'app-article-thumbnail',
  templateUrl: './article-thumbnail.component.html',
  styleUrls: ['./article-thumbnail.component.scss']
})
export class ArticleThumbnailComponent implements OnInit {

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

    let thresholds = [0,1];
    // let th = 0.1;
    // while (th < 0.9) {
    //   th = th + 0.1;
    //   thresholds.push(th);
    // }
    let options = {
      threshold: thresholds,
      root: this.rootArticle.nativeElement
    };
    setTimeout(() => {

      let observer = new IntersectionObserver((entries, observer) => {
        this.isStickHeader = !entries[0].isIntersecting && entries[0].intersectionRatio === 0;
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
