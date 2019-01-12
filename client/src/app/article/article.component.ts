import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";
import {FavoriteService} from "../shared/favorite-story.service";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],

})
export class ArticleComponent implements OnInit {
    public article: Article;
    public articleId: string;
    public isFavorite: boolean;

    @ViewChild('articleView')
    protected articleView: ElementRef;


    constructor(protected route: ActivatedRoute, protected articleService: ArticleService, protected favoriteService: FavoriteService) {
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
                this.isFavorite = this.favoriteService.isFavorite(article.story);


            });
        }
    }

    protected afterGetArticle(): void {
        (<HTMLElement>this.articleView.nativeElement).scroll({top: 0})
    }

    private getSourceUrl() {
        this.articleService.getSource(this.article.id).subscribe(url => {
            this.article.externalUrl = url;
        })
    }


    toggleFavorite() {
        this.isFavorite = !this.isFavorite
        if (this.article.story != null) {
            if (this.isFavorite) {
                this.favoriteService.addFavorite(this.article.story);
            } else {
                this.favoriteService.removeFavorite(this.article.story)
            }
        }

    }
}
