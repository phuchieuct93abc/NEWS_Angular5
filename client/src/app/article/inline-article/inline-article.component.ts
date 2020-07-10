import { ArticleComponent } from "../article.component";
import { ActivatedRoute } from "@angular/router";
import { ArticleService } from "../../shared/article.service";
import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from "@angular/core";
import { Story } from "../../../../../model/Story";
import { StoryListService } from "../../story/story-list/story-list.service";
import { CdkDrag } from "@angular/cdk/drag-drop";
import { DomService } from "../dom.service";
import { ConfigService } from "../../shared/config.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { StorySizechangeDetectorService } from "../../story/story/mobile-story/story-sizechange-detector.service";


const SWIPE_LEFT = "swipeLeft";
const SWIPE_RIGHT = "swipeRight";

@Component({
    selector: 'app-inline-article',
    templateUrl: './inline-article.component.html',
    styleUrls: ['./inline-article.component.scss'],
    animations: [
        trigger('swipe', [

            state('swipeLeft', style({ transform: "translateX(-110%)" })),
            state('swipeRight', style({ transform: "translateX(110%)" })),

            transition('show=>swipeRight', [
                style({ opacity: 1, height: '*' }),

                animate('0.2s', style({ opacity: 0, transform: "translateX(100%)" })),
            ]),
            transition('show=>swipeLeft', [
                style({ opacity: 1, height: '*' }),

                animate('0.2s', style({ opacity: 0,  transform: "translateX(-100%)" })),
            ]),

        ]),
        trigger('showArticle', [


            transition('void=>true', [
                style({ height: "0px" }),

                animate('0.1s', style({ height: "*" })),
            ]),
            transition("true=>false", [
                style({ height: "*" }),
                animate('0.1s', style({ height: "0" })),
            ])
        ]),


    ]


})

export class InlineArticleComponent extends ArticleComponent implements OnDestroy {

    @Output()
    onClosed = new EventEmitter();
    @ViewChild('articleBodyWrapper', { static: false })
    articleView: ElementRef;
    @ViewChild(CdkDrag, { static: false })
    view: CdkDrag;

    @Input()
    story: Story;

    private erd;

    animationName: string = 'none';
    isCollapseArticle: boolean = false;
    readonly closeThreshold = 50;

    @Output()
    onFinishedGetArticle = new EventEmitter<void>();

    constructor(protected route: ActivatedRoute,
        protected articleService: ArticleService,
        protected domService: DomService,
        protected configService: ConfigService,
        protected storyListService: StoryListService,
        private elementRef: ElementRef


    ) {
        super(route, articleService, domService, configService, storyListService);
    }


    ngOnInit() {
        super.ngOnInit();
        this.isCollapseArticle = true;//Expand article

        this.categoryId = this.route.snapshot.params["category"];
        this.articleId = this.story.id;


        super.getArticleById(this.articleId, this.categoryId);

    }
    registerStickyHeader() {
        //Override article in desktop mode
    }




    collapseArticle() {
        this.isCollapseArticle = false;
    }

    swipeleft() {
        this.animationName = SWIPE_LEFT;
        setTimeout(() => this.collapseArticle(), 100)
    }

    swiperight() {

        this.animationName = SWIPE_RIGHT;
        setTimeout(() => this.collapseArticle(), 100)
    }
    onPanEnd(direction) {
        if (direction === 'right') {
            this.swiperight();
        } else {
            this.swipeleft();
        }
    }

    protected afterGetArticle(): void {
        super.afterGetArticle();
        this.animationName = "show";

    }


    ngOnDestroy(): void {
        super.ngOnDestroy();
    }


    animEnd($event) {
        if ($event.toState == false) {
            this.story.selected = false;
            this.story.height = 0;

        } else {
            this.onFinishedGetArticle.emit();
        }




    }


}
