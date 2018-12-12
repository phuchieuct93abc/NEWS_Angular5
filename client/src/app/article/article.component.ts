import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

    @ViewChild('articleView')
    articleView: ElementRef;

    constructor(private route: ActivatedRoute, private articleService: ArticleService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            console.log(id);
            if (id) {
                this.articleService.getById(id).subscribe(article => {
                    this.article = article;
                    (<HTMLElement>this.articleView.nativeElement).scroll({top: 0})
                });
            }


        })
    }

}
