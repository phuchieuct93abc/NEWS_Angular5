import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";
import {FavoriteService} from "../shared/favorite-story.service";
import {HttpClient} from "@angular/common/http";
import ArticleContentParser from "./article-parser";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],

})
export class ArticleComponent implements OnInit {
    public article: Article;
    public articleId: string;
    public isFavorite: boolean;

    @ViewChild('articleContent')
    articleContent: ElementRef;

    @ViewChild('articleView')
    protected articleView: ElementRef;


    constructor(protected route: ActivatedRoute, protected articleService: ArticleService, protected favoriteService: FavoriteService,
                protected httpClient: HttpClient) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.articleId = params['id']
            this.showArticleById(params['id']);
        });


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
                new ArticleContentParser(videos[i]).parse();


            }
        }, 0)
    }


}
