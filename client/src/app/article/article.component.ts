import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";
import {DomService} from "./dom.service";
import {ConfigService} from "../shared/config.service";
import {Subscription} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import ArticleVideoParser from "./parsers/article-video.parser";


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
export class ArticleComponent implements OnInit, OnDestroy {
    public article: Article;
    public articleId: string;
    public categoryId: string;
    public isFavorite: boolean;

    @ViewChild('articleContent')
    articleContent: ElementRef;


    @ViewChild('articleView')
    protected articleView: ElementRef;
    routeParamSubscription: Subscription;
    configSubsription: Subscription;
    getArticleSubscription: Subscription;
    articleBody: string;

    public fontSize: number;
    @Output()
    onSelectArticle = new EventEmitter<Article>();
    constructor(protected route: ActivatedRoute, protected articleService: ArticleService,
                protected domService: DomService,
                protected configService: ConfigService) {


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
            this.article = null;
            this.articleId = null;
            setTimeout(() => {
                this.articleId = articleId;
                this.categoryId = categoryId;
                this.getArticleSubscription = this.articleService.getById(articleId, categoryId).subscribe(article => {

                    this.article = article;


                    this.articleService.onStorySelected.next(this.article);
                    this.afterGetArticle();
                });
            })


        }
    }

    protected afterGetArticle(): void {

        if (typeof this.articleView.nativeElement.scroll === 'function') {

            (<HTMLElement>this.articleView.nativeElement).scroll({top: 0});
        }
        //REPLACE IMAGE
        if (typeof window !== 'undefined') {

            // this.articleBody = this.article.body.replace(/src=/g, "data-src=")
            this.articleBody = this.article.body;

            this.parseHtml();
        } else {
            this.articleBody = this.article.body;
        }

    }


    private parseHtml() {


        setTimeout(() => {
            let element = <HTMLParagraphElement>this.articleContent.nativeElement;
            let videos: HTMLCollectionOf<Element> = element.getElementsByClassName('body-video');
            for (let i = 0; i < videos.length; i++) {

                new ArticleVideoParser(videos[i], this.domService).parse();
            }

            // let images: HTMLCollectionOf<HTMLImageElement> = element.getElementsByTagName('img');
            // for (let i = 0; i < images.length; i++) {
            //     new ArticleImageParser(images[i], this.domService).parse();
            // }
        }, 0)
    }


    ngOnDestroy(): void {
        this.routeParamSubscription.unsubscribe();
        this.configSubsription.unsubscribe();
        this.getArticleSubscription && this.getArticleSubscription.unsubscribe();
    }


}
