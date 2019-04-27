import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";
import {FavoriteService} from "../shared/favorite-story.service";
import ArticleContentParser from "./article-parser";
import {DomService} from "./dom.service";
import {ConfigService} from "../shared/config.service";
import {Subscription} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";


@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    animations: [
        trigger('showArticle', [
                transition(':enter', [
                    style({opacity: 0}),
                    animate('0.5s', style({opacity: 1})),
                ]),
            ]
        )
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

    constructor(protected route: ActivatedRoute, protected articleService: ArticleService, protected favoriteService: FavoriteService,
                protected domService: DomService,
                protected configService: ConfigService) {


    }

    ngOnInit() {
        this.fontSize = this.configService.getConfig().fontSize;
        this.routeParamSubscription = this.route.params.subscribe(params => {
            this.articleId = params['id'];
            this.categoryId = params['category'];
            this.showArticleById();
        });

        this.configSubsription = this.configService.configUpdated.subscribe((config) => {
            this.fontSize = config.new.fontSize
        });


    }

    protected showArticleById() {
        if (this.articleId) {
            this.article = null;

            this.getArticleSubscription = this.articleService.getById(this.articleId, this.categoryId).subscribe(article => {
                this.article = article;
                this.articleService.onStorySelected.next(this.article);
                this.isFavorite = this.favoriteService.findById(article.id) != undefined;
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

    toggleFavorite() {
        this.isFavorite = !this.isFavorite;
        if (this.article.story != null) {
            if (this.isFavorite) {
                this.favoriteService.addFavorite(this.article.story);
            } else {
                this.favoriteService.removeFavorite(this.article.story)
            }
            this.article.story.isFavorite = this.isFavorite
        }

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

}
