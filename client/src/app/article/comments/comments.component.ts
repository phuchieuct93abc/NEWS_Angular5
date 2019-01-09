import {Component, Input, OnInit} from '@angular/core';
import {ArticleService} from "../../shared/article.service";
import ArticleComment from "../../../../../model/ArticleComment";

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

    @Input()
    articleId: string;
    comments: ArticleComment[] = [];

    constructor(private articleService: ArticleService) {
    }

    ngOnInit() {
        this.articleService.getComment(this.articleId).subscribe(comments => {
            this.comments = comments;
        })
    }

}
