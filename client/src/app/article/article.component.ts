import { IS_NODE } from 'src/app/shared/const';
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Inject, Input, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Article from '../../../../model/Article';
import { Story } from '../../../../model/Story';
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
                animate('0.3s', style({ opacity: 0 }))
            ]),
            transition(':enter', [
                style({ opacity: 0, height: 0 }),
                animate('0.3s 0.3s',
                    style({ opacity: 1, height: '*' })
                )

            ])
        ]
        )

    ]

})
export class ArticleComponent implements OnInit, OnDestroy {

    @ViewChild('articleContent')
    public articleContent: ElementRef<HTMLParagraphElement>;
    @Input()
    public story: Story;
    @ViewChild('articleView')
    protected articleView: ElementRef<HTMLElement>;

    public article: Article;
    public articleId: string;
    public categoryId: string;
    public isFavorite: boolean;
    public articleBody: string;

    public fontSize: number;
    public isOpeningArticle: boolean;
    private onDestroy$ = new Subject<void>();
    private stopGetArticle$ = new Subject<void>();

    public constructor(
        @Inject(IS_NODE) private isNode: boolean,
        protected route: ActivatedRoute, protected articleService: ArticleService,
        protected domService: DomService,
        protected configService: ConfigService,
        protected storyListService: StoryListService,
        protected zone: NgZone

        ) {
    }

    public ngOnInit(): void{
        this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe((params) => {
            this.stopGetArticle$.next();
            this.resetArticle();
            this.getArticleById(params.id, params.category);
        });

        this.configService.getConfig().pipe(takeUntil(this.onDestroy$)).subscribe(({ fontSize }) => {
            this.fontSize = fontSize;
        });
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
    protected resetArticle(){
        this.articleId = null;
        this.article = null;
    }

    protected getArticleById(articleId, categoryId) {
        if (articleId && categoryId) {
            this.categoryId = categoryId;
            this.articleId = articleId;
            if (this.story?.article) {
                this.loadArticle(this.story.article);
            } else {

                this.articleService.getById(articleId, categoryId)
                    .pipe(takeUntil(this.onDestroy$)).subscribe((article) => {
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
    }

    private parseImage() {
        const element = this.articleContent.nativeElement;
        const images: NodeListOf<HTMLElement> = element.querySelectorAll('.body-image');
        images.forEach((image) => new ArticleImageParser(image, this.domService).parse());

    }

    private parseVideo() {
        const element = this.articleContent.nativeElement;
        const videos: NodeListOf<HTMLElement> = element.querySelectorAll('.body-video');
        videos.forEach((video) => new ArticleVideoParser(video, this.domService).parse());
    }
}
