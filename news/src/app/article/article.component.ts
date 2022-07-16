import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IS_NODE } from 'src/app/shared/const';
import Article from '../../../../model/Article';
import { Story } from '../../../../model/Story';
import { ArticleService } from '../shared/article.service';
import { readArticle } from '../store/actions';
import { configFeature } from '../store/config.reducer';
import { StoryListService } from '../story/story-list/story-list.service';
import { DomService } from './dom.service';
import ArticleImageParser from './parsers/article-image.parser';
import ArticleVideoParser from './parsers/article-video.parser';
import { SmoothScrollDirective } from './smooth-scroll.directive';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss', './article-content.scss'],

  animations: [
    trigger('showArticle', [
      transition(':leave', [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))]),
      transition(':enter', [style({ opacity: 0, height: 0 }), animate('0.3s 0.3s', style({ opacity: 1, height: '*' }))]),
    ]),
  ],
})
export class ArticleComponent implements OnInit, OnDestroy {
  @ViewChild('articleContent')
  public articleContent: ElementRef<HTMLParagraphElement>;
  @Input()
  public story: Story;
  @ViewChild('articleView')
  protected articleView: ElementRef<HTMLElement>;
  @ViewChild(SmoothScrollDirective)
  private smoothScrollDirective: SmoothScrollDirective;

  public article: Article;
  public articleId: string;
  public categoryId: string;
  public isFavorite: boolean;
  public articleBody: string;

  public fontSize$ = this.store.select(configFeature.selectFontSize);
  public isOpeningArticle: boolean;
  public iframeSource: string;
  public viewInSource$ = this.store.select(configFeature.selectViewInSource);
  private onDestroy$ = new Subject<void>();
  private stopGetArticle$ = new Subject<void>();

  public constructor(
    @Inject(IS_NODE) private isNode: boolean,
    protected route: ActivatedRoute,
    protected articleService: ArticleService,
    protected domService: DomService,
    protected storyListService: StoryListService,
    protected zone: NgZone,
    protected crd: ChangeDetectorRef,
    protected store: Store
  ) {}

  get articleViewEle(): HTMLElement {
    return this.articleView.nativeElement;
  }

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe((params) => {
      this.stopGetArticle$.next();
      this.resetArticle();
      this.getArticleById(params.id, params.category);
    });
  }

  public scrollUp(): void {
    this.smoothScrollDirective.up();
  }

  public scrollDown(): void {
    this.smoothScrollDirective.down();
  }

  public prevArticle(): void {
    this.storyListService.selectPrevStory();
  }

  public nextArticle(): void {
    this.storyListService.selectNextStory();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.stopGetArticle$.next();
    this.stopGetArticle$.complete();
  }
  protected resetArticle(): void {
    this.articleId = null;
    this.article = null;
  }

  protected getArticleById(articleId: string, categoryId: string): void {
    if (articleId && categoryId) {
      this.categoryId = categoryId;
      this.articleId = articleId;
      this.store.dispatch(readArticle({ articleId: this.articleId, categoryId: this.categoryId }));
      if (this.story?.article) {
        this.loadArticle(this.story.article);
      } else {
        this.articleService
          .getById(articleId, categoryId)
          .pipe(takeUntil(this.onDestroy$), takeUntil(this.stopGetArticle$))
          .subscribe((article) => {
            this.loadArticle(article);
          });
      }
    }
  }

  protected afterGetArticle(): void {
    this.articleBody = this.article.body;
    this.articleView?.nativeElement?.scroll?.({ top: 0 });

    if (!this.isNode) {
      setTimeout(() => {
        this.parseVideo();
        this.parseImage();
      });
    }
  }

  private loadArticle(article: Article) {
    this.article = article;
    this.articleService.onStorySelected.next(this.article);
    this.isOpeningArticle = this.story?.article !== undefined;
    this.afterGetArticle();
    // this.iframeSource = this.article.
  }

  private parseImage() {
    const element = this.articleContent.nativeElement;
    const images: NodeListOf<HTMLElement> = element.querySelectorAll('.body-image');
    images.forEach((image) => new ArticleImageParser(image, this.domService).parse());
  }

  private parseVideo() {
    const element = this.articleContent.nativeElement;
    const videos: NodeListOf<HTMLElement> = element.querySelectorAll('app-video');
    videos.forEach((video) => new ArticleVideoParser(video, this.domService).parse());
  }
}
