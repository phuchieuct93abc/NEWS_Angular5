import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleService} from "../../shared/article.service";
import ArticleComment from "../../../../../model/ArticleComment";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";

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
        this.isExpandedChange.emit(this.isExpandedValue)
    }


    constructor(private articleService: ArticleService, public breakpoint: BreakpointDetectorService) {
    }

    ngOnInit() {
        this.articleService.getComment(this.articleId).subscribe(comments => {
            this.comments = comments;
        })
        if (!this.isExpanded) {
            this.isExpanded = false;
        }
    }

}
