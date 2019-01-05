import {ArticleComponent} from "../article.component";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../shared/article.service";
import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";
import {Story} from "../../../../../model/Story";
import {StoryService} from "../../shared/story.service";
import {UtilityService} from "../../shared/utility.service";
import {StoryListService} from "../../story/story-list/story-list.service";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {throttle} from "rxjs/operators";
import {interval} from "rxjs";

@Component({
    selector: 'app-inline-article',
    templateUrl: './inline-article.component.html',
    styleUrls: ['./inline-article.component.scss'],

})
export class InlineArticleComponent extends ArticleComponent implements OnDestroy {

    @Output()
    onClosed = new EventEmitter();
    @ViewChild('closeIcon')
    closeIcon: ElementRef;
    @ViewChild('articleBodyWrapper')
    articleView: ElementRef;
    @ViewChild(CdkDrag)
    view: CdkDrag


    subscription;
    closeSubscription;
    @Input()
    story: Story;

    currentStoryIndex: number;
    readonly sensitive = 100;
    isFaddingRight = false;
    isFaddingLeft = false;
    isDisplayingInViewport = false;

    constructor(protected route: ActivatedRoute,
                protected articleService: ArticleService,
                private storyListService: StoryListService,
                private storyService: StoryService) {
        super(route, articleService)
    }


    ngOnInit() {

        this.showArticleById(this.story.id);
        // Hammer.defaults.touchAction = 'pan-y'


        this.subscription = this.storyListService.onScroll.pipe(throttle(() => interval(1000)))
            .subscribe(() => {
                const onViewport: boolean = UtilityService.isElementInViewport(<HTMLElement>this.articleView.nativeElement);
                if (this.isDisplayingInViewport !== onViewport) {
                    if (onViewport) {
                        this.storyListService.onShowFixedCloseIcon.next(this.story);

                    } else {

                        this.storyListService.onShowFixedCloseIcon.next(null);
                    }
                    this.isDisplayingInViewport = onViewport;
                }
            });

        this.closeSubscription = this.storyListService.onFixedCloseClicked.subscribe(() => {
            this.close(null);
        })
    }


    close(event) {
        if (event) {

            event && event.stopPropagation();
        }
        this.storyListService.onShowFixedCloseIcon.next(null);
        this.storyListService.scrollTo.next(this.story);


        setTimeout(() => {
            this.onClosed.emit();
        }, 500);
    }

    afterGetArticle() {
        this.currentStoryIndex = this.storyService.getStorySnapshot().indexOf(this.story);
    }

    ngOnDestroy(): void {
        // this.storyListService.onShowFixedCloseIcon.next(null);
        this.subscription.unsubscribe();
        this.closeSubscription.unsubscribe();
    }

    swipeleft($event) {
        // const position = $event.source._activeTransform.x;
        // if (Math.abs(position) > this.sensitive) {
        //     if (position > 0) {
        //         this.isFaddingRight = true;
        //     } else {
        //         this.isFaddingLeft = true;
        //     }
        //
        // } else {
        //     console.log(this.view.reset())
        //
        // }
        // if($event.deltaX>500){

        this.isFaddingLeft = true;
        setTimeout(() => {

            this.close(null);
        }, 500)
        // }


        // console.log('swipe left',$event)

    }

    swiperight($event) {
        this.isFaddingRight = true;
        setTimeout(() => {

            this.close(null);
        }, 500)
    }
}
