import {Component, Input, OnInit} from '@angular/core';
import ArticleComment from '../../../../../../model/ArticleComment';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

    @Input()
    comment: ArticleComment;

    constructor() {
    }

    ngOnInit() {
       this.comment.avatar = this.comment.avatar.replace('http://','https://');
    }

}
