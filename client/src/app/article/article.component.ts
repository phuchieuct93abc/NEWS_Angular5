import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ArticleService } from "../shared/article.service";
import Article from "../../../../model/Article";
import { DomService } from "./dom.service";
import { ConfigService } from "../shared/config.service";
import { Subscription, interval, Observable, Subject, timer } from "rxjs";
import { animate, style, transition, trigger } from "@angular/animations";
import ArticleVideoParser from "./parsers/article-video.parser";
import RequestAnimationFrame from "../requestAnimationFrame.cons";
import { StoryListService } from "../story/story-list/story-list.service";
import ArticleImageParser from "./parsers/article-image.parser";
import { takeUntil, throttle, debounce } from 'rxjs/operators';
@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss', './article-content.scss'],

    animations: [
        trigger('showArticle', [

            transition(':leave', [
                style({ opacity: 1 }),
                animate("0.3s", style({ opacity: 0 })),
            ]),
            transition(':enter', [
                style({ opacity: 0, height: 0 }),
                animate('0.3s 0.3s',
                    style({ opacity: 1, height: '*' }),
                )

            ])
        ]
        ),

    ],

})
export class ArticleComponent implements OnInit {
    public article: Article;
    public articleId: string;
    public categoryId: string;
    public isFavorite: boolean;

    @ViewChild('articleContent', { static: false })
    articleContent: ElementRef;


    @ViewChild('articleView', { static: false })
    protected articleView: ElementRef;

    articleBody: string;

    public fontSize: number;
    onDestroy$ = new Subject<void>();
    stopGetArticle$ =  new Subject<void>();

    constructor(protected route: ActivatedRoute, protected articleService: ArticleService,
        protected domService: DomService,
        protected configService: ConfigService,
        protected storyListService: StoryListService) {
    }

    ngOnInit() {
        this.fontSize = this.configService.getConfig().fontSize;
        this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
            this.stopGetArticle$.next();
            this.articleId = null;
            this.getArticleById(params['id'], params['category']);
        });

        this.configService.configUpdated.pipe(takeUntil(this.onDestroy$)).subscribe((config) => {
            this.fontSize = config.new.fontSize
        });
    }

    protected getArticleById(articleId, categoryId) {
        if (articleId && categoryId) {
            this.categoryId = categoryId;
            this.articleId = articleId;
            this.article = null;
            this.articleService.getById(articleId, categoryId).pipe(takeUntil(this.stopGetArticle$)).subscribe(article => {
                this.article = article;
                this.articleService.onStorySelected.next(this.article);
                this.afterGetArticle();
            });


        }
    }

    protected afterGetArticle(): void {

        if (this.articleView && typeof this.articleView.nativeElement.scroll === 'function') {

            (<HTMLElement>this.articleView.nativeElement).scroll({ top: 0 });
        }
        this.articleBody = this.article.body;

        if (typeof window !== 'undefined') {
            // this.registerStickyHeader();

            RequestAnimationFrame(() => {
                this.parseVideo();
                this.parseImage();
                // this.resetStickyHeader();

            })

        }


    }

    

    private parseImage() {

        let element = <HTMLParagraphElement>this.articleContent.nativeElement;
        let images: HTMLCollectionOf<Element> = element.getElementsByClassName('body-image');
        for (let i = 0; i < images.length; i++) {
            new ArticleImageParser(images[i], this.domService).parse();
        }
    }

    private parseVideo() {
        let element = <HTMLParagraphElement>this.articleContent.nativeElement;
        let videos: HTMLCollectionOf<Element> = element.getElementsByClassName('body-video');
        for (let i = 0; i < videos.length; i++) {
            new ArticleVideoParser(videos[i], this.domService).parse();
        }
    }

    up() {

        let articleView = <HTMLDivElement>this.articleView.nativeElement;
        articleView.scrollTo({ top: articleView.scrollTop - 100,  });
    }

    down() {
        let articleView = <HTMLDivElement>this.articleView.nativeElement;
        articleView.scrollTo({ top: articleView.scrollTop + 100,  });
    }


    prevArticle() {

        this.storyListService.selectPrevStory();
    }

    nextArticle() {
        this.storyListService.selectNextStory();
    }

    ngOnDestroy(): void {
      this.onDestroy$.next();
    }


}
