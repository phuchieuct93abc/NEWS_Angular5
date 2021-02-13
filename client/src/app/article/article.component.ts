import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Article from '../../../../model/Article';
import RequestAnimationFrame from '../requestAnimationFrame.cons';
import { ArticleService } from '../shared/article.service';
import { ConfigService } from '../shared/config.service';
import { StoryListService } from '../story/story-list/story-list.service';
import { DomService } from './dom.service';
import ArticleImageParser from './parsers/article-image.parser';
import ArticleVideoParser from './parsers/article-video.parser';
@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss', './article-content.scss'],

    animations: [
        trigger('showArticle', [

            transition(':leave', [
                style({ opacity: 1 }),
                animate('0.3s', style({ opacity: 0 })),
            ]),
            transition(':enter', [
                style({ opacity: 0, height: 0 }),
                animate('0.3s 0.3s',
                    style({ opacity: 1, height: '*' }),
                ),

            ]),
        ],
        ),

    ],

})
export class ArticleComponent implements OnInit, OnDestroy {

    @ViewChild('articleContent')
    public articleContent: ElementRef<HTMLParagraphElement>;
    @ViewChild('articleView')
    protected articleView: ElementRef<HTMLElement>;

    public article: Article;
    public articleId: string;
    public categoryId: string;
    public isFavorite: boolean;
    public articleBody: string;

    public fontSize: number;
    private onDestroy$ = new Subject<void>();
    private stopGetArticle$ = new Subject<void>();

    public constructor(protected route: ActivatedRoute, protected articleService: ArticleService,
        protected domService: DomService,
        protected configService: ConfigService,
        protected storyListService: StoryListService) {
    }

    public ngOnInit() {
        this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe((params) => {
            this.stopGetArticle$.next();
            this.articleId = null;
            this.getArticleById(params.id, params.category);
        });

        this.configService.getConfig().pipe(takeUntil(this.onDestroy$)).subscribe(({ fontSize }) => {
            this.fontSize = fontSize;
        });
    }

    public onScroll() {
        window.dispatchEvent(new CustomEvent('scroll'));
    }

    public up() {
        const articleView = this.articleView.nativeElement;
        articleView.scrollTo({ top: articleView.scrollTop - 100 });
    }

    public down() {
        const articleView = this.articleView.nativeElement;
        articleView.scrollTo({ top: articleView.scrollTop + 100 });
    }


    public prevArticle() {
        this.storyListService.selectPrevStory();
    }

    public nextArticle() {
        this.storyListService.selectNextStory();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    protected getArticleById(articleId, categoryId) {
        if (articleId && categoryId) {
            this.categoryId = categoryId;
            this.articleId = articleId;
            this.article = null;
            this.articleService.getById(articleId, categoryId).pipe(takeUntil(this.onDestroy$)).subscribe((article) => {
                this.article = article;
                this.articleService.onStorySelected.next(this.article);
                this.afterGetArticle();
            });
        }
    }

    protected afterGetArticle(): void {

        if (this.articleView && typeof this.articleView.nativeElement.scroll === 'function') {
            this.articleView.nativeElement.scroll({ top: 0 });
        }
        this.articleBody = this.article.body;

        if (typeof window !== 'undefined') {
            RequestAnimationFrame(() => {
                this.parseVideo();
                this.parseImage();
            });
        }
    }


    private parseImage() {
        const element = this.articleContent.nativeElement;
        const images: NodeListOf<HTMLElement> = element.querySelectorAll('.body-image');
        images.forEach((image) => new ArticleImageParser(image, this.domService).parse());

    }

    private parseVideo() {
        const element = this.articleContent.nativeElement;
        const videos: NodeListOf<HTMLElement> = element.querySelectorAll('.body-video');
        videos.forEach((video)=>new ArticleVideoParser(video, this.domService).parse());
    }
}
