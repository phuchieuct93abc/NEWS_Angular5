import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],

})
export class ArticleComponent implements OnInit {
    public article: Article;
    public articleId: string;
    public isFavorite = false;

    @ViewChild('articleView')
    protected articleView: ElementRef;


    constructor(protected route: ActivatedRoute, protected articleService: ArticleService) {
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


    toogeFavorite() {
        this.isFavorite = !this.isFavorite
    }
}
