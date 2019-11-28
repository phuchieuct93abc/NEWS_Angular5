import {ArticleComponent} from "../article.component";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../shared/article.service";
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";
import {Story} from "../../../../../model/Story";
import {StoryListService} from "../../story/story-list/story-list.service";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {DomService} from "../dom.service";
import {ConfigService} from "../../shared/config.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {StorySizechangeDetectorService} from "../../story/story/mobile-story/story-sizechange-detector.service";
import * as  elementResizeDetectorMaker from "element-resize-detector";


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

                animate('0.2s', style({opacity: 0, transform: "translateX(100%)"})),
            ]),
            transition('show=>swipeLeft', [
                style({opacity: 1}),

                animate('0.2s', style({opacity: 0, transform: "translateX(-100%)"})),
            ]),

        ]),
        trigger('showArticle', [


            transition('void=>true', [
                style({height: "0px"}),

                animate('0.1s', style({height: "*"})),
            ]),
            transition("true=>false", [
                style({height: "*"}),
                animate('0.1s', style({height: "0"})),
            ])
        ]),


    ]


})

export class InlineArticleComponent extends ArticleComponent implements OnDestroy, AfterViewInit {

    @Output()
    onClosed = new EventEmitter();
    @ViewChild('articleBodyWrapper', {static: false})
    articleView: ElementRef;
    @ViewChild(CdkDrag, {static: false})
    view: CdkDrag;

    @Input()
    story: Story;

    private erd;

    animationName: string = 'none';
    private isShowArticle: boolean = false;

    @Output()
    onFinishedGetArticle = new EventEmitter<void>();


    constructor(protected route: ActivatedRoute,
                protected articleService: ArticleService,
                protected domService: DomService,
                protected configService: ConfigService,
                private changeDetector: StorySizechangeDetectorService,
                protected storyListService: StoryListService,


    ) {
        super(route, articleService, domService, configService,storyListService);
    }


    ngOnInit() {
        super.ngOnInit();
        this.isShowArticle = true;

        this.categoryId = this.route.snapshot.params["category"];
        this.articleId = this.story.id;


        super.getArticleById(this.articleId, this.categoryId);

    }

    ngAfterViewInit(): void {
        this.erd = elementResizeDetectorMaker({
            strategy: "scroll" //<- For ultra performance.

        });
        this.erd.listenTo((<HTMLDivElement>this.articleView.nativeElement).closest("app-mobile-story"), () => {
            this.changeDetector.sizeDetector.next(this.story);
        });
    }


    close() {
        this.isShowArticle = false;
    }

    swipeleft() {

        this.animationName = SWIPE_LEFT;
        setTimeout(() => this.close(), 0)


    }

    swiperight() {
        this.animationName = SWIPE_RIGHT;
        setTimeout(() => this.close(), 0)
    }

    protected afterGetArticle(): void {
        super.afterGetArticle();
        this.animationName = "show";

    }


    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.erd.uninstall((<HTMLDivElement>this.articleView.nativeElement).closest("app-mobile-story"));


    }


    animEnd($event) {
        if ($event.toState == false) {
            this.onClosed.emit();
            this.storyListService.scrollTo.next(this.story);
        } else {
            this.onFinishedGetArticle.emit();
        }


    }


}
