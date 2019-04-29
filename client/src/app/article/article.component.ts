import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";
import ArticleContentParser from "./article-parser";
import {DomService} from "./dom.service";
import {ConfigService} from "../shared/config.service";
import {Subscription} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";

const animationTime = 300

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    animations: [
        trigger('showArticle', [

                transition(':leave', [
                    style({opacity: 1}),
                    animate(animationTime, style({opacity: 0})),
                ]),
                transition(':enter', [
                    style({opacity: 0}),
                    animate(animationTime, style({opacity: 1})),
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

    public fontSize: number;
    transitionName: string;

    constructor(protected route: ActivatedRoute, protected articleService: ArticleService,
                protected domService: DomService,
                protected configService: ConfigService) {


    }

    ngOnInit() {
        this.fontSize = this.configService.getConfig().fontSize;
        this.routeParamSubscription = this.route.params.subscribe(params => {
            this.articleId = null;

            let getArticlePromise = this.getArticle(params['id'], params['category']);

            setTimeout(() => {
                this.articleId = params['id'];

                this.transitionName = this.articleId;
                this.categoryId = params['category'];
                this.getArticleById(getArticlePromise);
            }, animationTime)

        });

        this.configSubsription = this.configService.configUpdated.subscribe((config) => {
            this.fontSize = config.new.fontSize
        });


    }

    protected getArticleById(promise: Promise<Article>) {
        if (this.articleId) {
            this.article = null;


            promise.then(article => {

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
        this.parseHtml();
    }


    private parseHtml() {
        if (typeof window !== 'undefined') {

            setTimeout(() => {
                let element = <HTMLParagraphElement>this.articleContent.nativeElement;
                let videos: HTMLCollectionOf<Element> = element.getElementsByClassName('body-video');
                for (let i = 0; i < videos.length; i++) {
                    new ArticleContentParser(videos[i], this.domService).parse();
                }
            }, 0)
        }
    }


    ngOnDestroy(): void {
        this.routeParamSubscription.unsubscribe();
        this.configSubsription.unsubscribe();
        this.getArticleSubscription && this.getArticleSubscription.unsubscribe();
    }

    getArticle(articleId, categoryId): Promise<Article> {
        if (!articleId || !categoryId) {
            return Promise.reject();
        }
        return new Promise(resolver => {
            this.getArticleSubscription = this.articleService.getById(articleId, categoryId).subscribe(article => {

                resolver(article)

            });
        })
    }

}
