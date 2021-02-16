import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Story } from '../../../../../model/Story';
import { ArticleService } from '../../shared/article.service';
import { ConfigService } from '../../shared/config.service';
import { StoryListService } from '../../story/story-list/story-list.service';
import { ArticleComponent } from '../article.component';
import { DomService } from '../dom.service';


const SWIPE_LEFT = 'swipeLeft';
const SWIPE_RIGHT = 'swipeRight';

@Component({
    selector: 'app-inline-article',
    templateUrl: './inline-article.component.html',
    styleUrls: ['./inline-article.component.scss'],
    animations: [
        trigger('swipe', [

            state('swipeLeft', style({ transform: 'translateX(-110%)' })),
            state('swipeRight', style({ transform: 'translateX(110%)' })),

            transition('show=>swipeRight', [
                style({ opacity: 1, height: '*' }),

                animate('0.2s', style({ opacity: 0, transform: 'translateX(100%)' })),
            ]),
            transition('show=>swipeLeft', [
                style({ opacity: 1, height: '*' }),

                animate('0.2s', style({ opacity: 0, transform: 'translateX(-100%)' })),
            ]),

        ]),
        trigger('showArticle', [
            transition('void=>true', [
                style({ height: '0px' }),

                animate('0.1s', style({ height: '*' })),
            ]),
            transition('true=>false', [
                style({ height: '*' }),
                animate('0.1s', style({ height: '0' })),
            ]),
        ]),


    ],


})

export class InlineArticleComponent extends ArticleComponent implements OnDestroy, OnInit {

    @Output()
    public onClosed = new EventEmitter();
    @Output()
    public onFinishedGetArticle = new EventEmitter<void>();
    @ViewChild('articleBodyWrapper')
    public articleView: ElementRef;
    @ViewChild(CdkDrag)
    public view: CdkDrag;

  

    public animationName = 'none';
    public isCollapseArticle = false;

    public readonly closeThreshold = 50;


    public ngOnInit() {
        super.ngOnInit();
        this.isCollapseArticle = true;//Expand article

        this.categoryId = this.route.snapshot.params.category;
        this.articleId = this.story.id;


       super.getArticleById(this.articleId, this.categoryId);

    }
    public registerStickyHeader() {
        //Override article in desktop mode
    }

 

    public collapseArticle() {
        this.isCollapseArticle = false;
    }

    public swipeleft() {
        this.animationName = SWIPE_LEFT;
        setTimeout(() => this.collapseArticle(), 100);
    }

    public swiperight() {
        this.animationName = SWIPE_RIGHT;
        setTimeout(() => this.collapseArticle(), 100);
    }
    public onPanEnd(direction) {
        if (direction === 'right') {
            this.swiperight();
        } else {
            this.swipeleft();
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public animEnd($event) {
        if (!$event.toState) {
            this.story.selected = false;
            this.story.height = 0;
            this.onClosed.emit();
        } else {
            this.onFinishedGetArticle.emit();
        }
    }

    protected afterGetArticle(): void {
        super.afterGetArticle();
        this.animationName = 'show';
    }
    protected resetArticle(){
        //Don't need to reset article
    }

}
