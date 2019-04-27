import {ArticleComponent} from "../article.component";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../shared/article.service";
import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";
import {Story} from "../../../../../model/Story";
import {StoryListService} from "../../story/story-list/story-list.service";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {FavoriteService} from "../../shared/favorite-story.service";
import {DomService} from "../dom.service";
import {ConfigService} from "../../shared/config.service";
import {animate, state, style, transition, trigger} from "@angular/animations";


const SWIPE_LEFT = "swipeLeft";
const SWIPE_RIGHT = "swipeRight";

@Component({
    selector: 'app-inline-article',
    templateUrl: './inline-article.component.html',
    styleUrls: ['./inline-article.component.scss'],
    animations: [
        trigger('swipe', [

            state('swipeLeft',style({transform: "translateX(-100%)"})),
            state('swipeRight',style({transform: "translateX(100%)"})),

            transition('none=>swipeRight', [
                style({opacity: 1}),

                animate('0.5s', style({opacity: 0, transform: "translateX(100%)"})),
            ]),
            transition('none=>swipeLeft', [
                style({opacity: 1}),

                animate('0.5s', style({opacity: 0, transform: "translateX(-100%)"})),
            ])
        ]),

    ]


})

export class InlineArticleComponent extends ArticleComponent implements OnDestroy {

    @Output()
    onClosed = new EventEmitter();
    @ViewChild('articleBodyWrapper')
    articleView: ElementRef;
    @ViewChild(CdkDrag)
    view: CdkDrag;

    @Input()
    story: Story;

    isShowArticle: boolean = true;


    animationName: string = 'none';


    constructor(protected route: ActivatedRoute,
                protected articleService: ArticleService,
                private storyListService: StoryListService,
                protected  favoriteService: FavoriteService,
                protected domService: DomService,
                protected configService: ConfigService,
    ) {
        super(route, articleService, favoriteService, domService, configService);
    }


    ngOnInit() {
        super.ngOnInit();

        this.categoryId = this.route.snapshot.params["category"];
        this.articleId = this.story.id;

        super.showArticleById();

    }


    close() {
        this.isShowArticle = false;

        this.storyListService.scrollTo.next(this.story);
        setTimeout(() => {
            this.onClosed.emit();
        }, 500);
    }

    swipeleft() {

        this.animationName = SWIPE_LEFT;
        setTimeout(() => {
            this.close();
        }, 500)

    }

    swiperight() {
        this.animationName = SWIPE_RIGHT;
        setTimeout(() => {
            this.close();
        }, 500)
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
