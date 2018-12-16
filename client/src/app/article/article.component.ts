import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
    article: Article;
    @Input()
    articleId: string;

    @ViewChild('articleView')
    articleView: ElementRef;

    constructor(private route: ActivatedRoute, private articleService: ArticleService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.showArticleById(params['id']);
        });
        this.showArticleById(this.articleId);
    }


    private showArticleById(id: string) {
        if (id) {
            this.articleService.getById(id).subscribe(article => {
                this.article = article;
                (<HTMLElement>this.articleView.nativeElement).scroll({top: 0})
            });
        }
    }

}
