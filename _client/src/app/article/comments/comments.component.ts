import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleService} from '../../shared/article.service';
import ArticleComment from '../../../../../model/ArticleComment';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

    @Input()
    articleId: string;
    comments: ArticleComment[];

    isExpandedValue: boolean;

    @Output()
    isExpandedChange = new EventEmitter<boolean>();

    @Input()
    get isExpanded() {
        return this.isExpandedValue;
    }

    set isExpanded(val) {
        this.isExpandedValue = val;
    }


    constructor(private articleService: ArticleService) {
    }

    ngOnInit() {
        this.articleService.getComment(this.articleId).subscribe((comments) => {
            this.comments = comments;
        });
        if (!this.isExpanded) {
            this.isExpanded = false;
        }
    }

}
