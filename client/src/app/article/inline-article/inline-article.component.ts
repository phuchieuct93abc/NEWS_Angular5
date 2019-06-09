import {ArticleComponent} from "../article.component";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../shared/article.service";
import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";
import {Story} from "../../../../../model/Story";
import {StoryListService} from "../../story/story-list/story-list.service";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {DomService} from "../dom.service";
import {ConfigService} from "../../shared/config.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatSidenav} from "@angular/material";


const SWIPE_LEFT = "swipeLeft";
const SWIPE_RIGHT = "swipeRight";

@Component({
    selector: 'app-inline-article',
    templateUrl: './inline-article.component.html',
    styleUrls: ['./inline-article.component.scss'],
    animations: [
        trigger('swipe', [

            state('swipeLeft', style({transform: "translateX(-110%)"})),
            state('swipeRight', style({transform: "translateX(110%)"})),

            transition('show=>swipeRight', [
                style({opacity: 1}),

                animate('0.5s', style({opacity: -0.5, transform: "translateX(100%)"})),
            ]),
            transition('show=>swipeLeft', [
                style({opacity: 1}),

                animate('0.5s', style({opacity: -0.5, transform: "translateX(-100%)"})),
            ]),

        ]),
        trigger('showArticle', [


            transition('*=>*', [
                style({height: "0px"}),

                animate('1s', style({height: "*"})),
            ])
        ]),


    ]


})

export class InlineArticleComponent extends ArticleComponent implements OnDestroy {

    @Output()
    onClosed = new EventEmitter();
    @ViewChild('articleBodyWrapper',{static:false})
    articleView: ElementRef;
    @ViewChild(CdkDrag,{static:false})
    view: CdkDrag;

    @Input()
    story: Story;

    isShowArticle: boolean = true;


    animationName: string = 'none';


    constructor(protected route: ActivatedRoute,
                protected articleService: ArticleService,
                private storyListService: StoryListService,
                protected domService: DomService,
                protected configService: ConfigService,
    ) {
        super(route, articleService, domService, configService);
    }


    ngOnInit() {
        super.ngOnInit();

        this.categoryId = this.route.snapshot.params["category"];
        this.articleId = this.story.id;

        super.getArticleById(this.articleId, this.categoryId);

    }


    close() {
        this.isShowArticle = false;

        this.storyListService.scrollTo.next(this.story);
        setTimeout(() => {
            requestAnimationFrame(() => this.onClosed.emit())

        }, 500);
    }

    swipeleft() {

        this.animationName = SWIPE_LEFT;
        setTimeout(() => {
            requestAnimationFrame(() => this.close());
        }, 500)

    }

    swiperight() {
        this.animationName = SWIPE_RIGHT;
        setTimeout(() => {
            requestAnimationFrame(()=>this.close())
        }, 500)
    }

    protected afterGetArticle(): void {
        super.afterGetArticle();
        this.animationName = "show"
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
