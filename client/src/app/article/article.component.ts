import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";
import {FavoriteService} from "../shared/favorite-story.service";
import ArticleContentParser from "./article-parser";
import {DomService} from "./dom.service";
import {ConfigService} from "../shared/config.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],

})
export class ArticleComponent implements OnInit, OnDestroy {
    public article: Article;
    public articleId: string;
    public isFavorite: boolean;

    @ViewChild('articleContent')
    articleContent: ElementRef;

    @ViewChild('articleView')
    protected articleView: ElementRef;
    routeParamSubscription: Subscription
    configSubsription: Subscription

    public fontSize: number;

    constructor(protected route: ActivatedRoute, protected articleService: ArticleService, protected favoriteService: FavoriteService,
                protected domService: DomService,
                protected configService: ConfigService) {

    }

    ngOnInit() {
        this.fontSize = this.configService.getConfig().fontSize;
        this.routeParamSubscription = this.route.params.subscribe(params => {
            this.articleId = params['id']
            this.showArticleById(params['id']);
        });

        this.configSubsription = this.configService.configUpdated.subscribe((config) => {
            this.fontSize = config.new.fontSize
        })


    }

    protected showArticleById(articleId: string) {
        if (articleId) {
            this.article = null;
            this.articleService.getById(articleId).subscribe(article => {
                this.article = article;
                this.getSourceUrl();
                this.afterGetArticle();
                this.articleService.onStorySelected.next(this.article);
                this.isFavorite = this.favoriteService.findById(article.id) != undefined;


            });

        }
    }

    protected afterGetArticle(): void {
        (<HTMLElement>this.articleView.nativeElement).scroll({top: 0});
        this.parseHtml();
    }

    private getSourceUrl() {
        this.articleService.getSource(this.article.id).subscribe(url => {
            this.article.externalUrl = url;
        })
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
        setTimeout(() => {
            let element = <HTMLParagraphElement>this.articleContent.nativeElement;
            let videos: HTMLCollectionOf<Element> = element.getElementsByClassName('body-video');
            for (let i = 0; i < videos.length; i++) {
                new ArticleContentParser(videos[i], this.domService).parse();


            }
        }, 1000)
    }

    ngOnDestroy(): void {
        this.routeParamSubscription.unsubscribe();
        this.configSubsription.unsubscribe();
    }


}
