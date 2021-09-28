import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ArticleComponent } from '../article.component';

const SWIPE_LEFT = 'swipeLeft';
const SWIPE_RIGHT = 'swipeRight';

@Component({
  selector: 'app-inline-article',
  templateUrl: './inline-article.component.html',
  styleUrls: ['../article.component.scss', './inline-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('swipe', [
      state('swipeLeft', style({ transform: 'translateX(-110%)' })),
      state('swipeRight', style({ transform: 'translateX(110%)' })),

      transition('show=>swipeRight', [style({ opacity: 1, height: '*' }), animate('0.2s', style({ opacity: 0, transform: 'translateX(100%)' }))]),
      transition('show=>swipeLeft', [style({ opacity: 1, height: '*' }), animate('0.2s', style({ opacity: 0, transform: 'translateX(-100%)' }))]),
    ]),
    trigger('showArticle', [
      transition('void=>true', [style({ height: '130px' }), animate('0.3s', style({ height: '*' }))]),
      transition('true=>false', [style({ height: '*' }), animate('0.1s', style({ height: '0' }))]),
    ]),
  ],
})
export class InlineArticleComponent extends ArticleComponent implements OnDestroy, OnInit {
  @Output()
  public onClosed = new EventEmitter();
  @ViewChild('articleBodyWrapper')
  public articleView: ElementRef;

  public animationName = 'none';
  public isCollapseArticle = false;

  public readonly closeThreshold = 50;

  public ngOnInit() {
    super.ngOnInit();
    this.isCollapseArticle = true; //Expand article

    this.categoryId = this.route.snapshot.params.category as string;
    this.articleId = this.story.id;

    super.getArticleById(this.articleId, this.categoryId);
  }
  public registerStickyHeader() {
    //Override article in desktop mode
  }

  public collapseArticle() {
    this.isCollapseArticle = false;
    this.crd.markForCheck();
  }

  public swipeleft() {
    this.animationName = SWIPE_LEFT;
    setTimeout(() => this.collapseArticle(), 100);
  }

  public swiperight() {
    this.animationName = SWIPE_RIGHT;
    setTimeout(() => this.collapseArticle(), 100);
  }
  public onPanEnd(direction) {
    if (direction === 'right') {
      this.swiperight();
    } else {
      this.swipeleft();
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public animEnd($event) {
    if (!$event.toState) {
      this.story.selected = false;
      this.story.height = 0;
      this.onClosed.emit();
    }
  }

  protected afterGetArticle(): void {
    super.afterGetArticle();
    this.animationName = 'show';
    this.crd.markForCheck();
  }
  protected resetArticle() {
    //Don't need to reset article
  }
}
