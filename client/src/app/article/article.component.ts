import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../shared/article.service";
import Article from "../../../../model/Article";

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.css'],

})
export class ArticleComponent implements OnInit {
    protected article: Article;
    @Input()
    protected articleId: string;


    @ViewChild('articleView')
    protected articleView: ElementRef;

    constructor(protected route: ActivatedRoute, protected articleService: ArticleService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.showArticleById(params['id']);
        });
    }


    protected showArticleById(id: string) {
        if (id) {
            this.articleService.getById(id).subscribe(article => {
                this.article = article;
                this.scrollToTop();
            });
        }
    }

    protected scrollToTop(): void {
        (<HTMLElement>this.articleView.nativeElement).scroll({top: 0})
    }


}
