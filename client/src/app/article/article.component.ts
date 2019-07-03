import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";
import {DomService} from "./dom.service";
import {ConfigService} from "../shared/config.service";
import {Subscription} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import ArticleVideoParser from "./parsers/article-video.parser";
import RequestAnimationFrame from "../requestAnimationFrame.cons";
import {StoryListService} from "../story/story-list/story-list.service";


@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],

    animations: [
        trigger('showArticle', [

                transition(':leave', [
                    style({opacity: 1}),
                    animate("0.3s", style({opacity: 0})),
                ]),
                transition(':enter', [
                    style({opacity: 0, height: 0}),
                    animate('0.3s 0.3s',
                        style({opacity: 1, height: '*'}),
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

    @ViewChild('articleContent', {static: false})
    articleContent: ElementRef;


    @ViewChild('articleView', {static: false})
    protected articleView: ElementRef;
    routeParamSubscription: Subscription;
    configSubsription: Subscription;
    articleBody: string;


    public fontSize: number;

    constructor(protected route: ActivatedRoute, protected articleService: ArticleService,
                protected domService: DomService,
                protected configService: ConfigService,
                protected storyListService: StoryListService) {


    }

    ngOnInit() {
        this.fontSize = this.configService.getConfig().fontSize;
        this.routeParamSubscription = this.route.params.subscribe(params => {
            this.articleId = null;
            this.getArticleById(params['id'], params['category']);

        });

        this.configSubsription = this.configService.configUpdated.subscribe((config) => {
            this.fontSize = config.new.fontSize
        });


    }

    protected getArticleById(articleId, categoryId) {
        if (articleId && categoryId) {
            this.categoryId = categoryId;
            this.articleId = articleId;
            this.article = null;
            this.articleService.getById(articleId, categoryId).then(article => {
                this.article = article;
                this.articleService.onStorySelected.next(this.article);
                this.afterGetArticle();
            });


        }
    }

    protected afterGetArticle(): void {

        if (typeof this.articleView.nativeElement.scroll === 'function') {

            (<HTMLElement>this.articleView.nativeElement).scroll({top: 0});
        }
        this.articleBody = this.article.body;

        if (typeof window !== 'undefined') {

            this.parseVideo();
        }


    }


    private parseVideo() {
        RequestAnimationFrame(() => {
            let element = <HTMLParagraphElement>this.articleContent.nativeElement;
            let videos: HTMLCollectionOf<Element> = element.getElementsByClassName('body-video');
            for (let i = 0; i < videos.length; i++) {
                new ArticleVideoParser(videos[i], this.domService).parse();
            }
        })
    }

    @HostListener('document:keyup', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key == 'ArrowLeft') {
            this.prevArticle();

        } else if (event.key == 'ArrowRight') {
            this.nextArticle();
        }

    }


    prevArticle() {

        this.storyListService.selectPrevStory();
    }

    nextArticle() {
        this.storyListService.selectNextStory();
    }

    ngOnDestroy(): void {
        this.routeParamSubscription.unsubscribe();
        this.configSubsription.unsubscribe();
    }
}
