import {ArticleComponent} from "../article.component";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../shared/article.service";
import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";
import {StoryListService} from "../../shared/story-list.service";
import {Story} from "../../../../../model/Story";
import {StoryService} from "../../shared/story.service";

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


    subscription;
    closeSubscription;
    @Input()
    story: Story;

    currentStoryIndex: number;


    constructor(protected route: ActivatedRoute,
                protected articleService: ArticleService,
                private storyListService: StoryListService,
                private storyService: StoryService) {
        super(route, articleService)
    }


    ngOnInit() {

        this.showArticleById(this.story.id);


        this.subscription = this.storyListService.onScroll.subscribe(event => {
            const articlePosition = this.articleView.nativeElement.getBoundingClientRect();
            if (articlePosition.y < 60 && articlePosition.bottom > 0) {
                this.storyListService.onShowFixedCloseIcon.next(this.story)

            } else {
                this.storyListService.onShowFixedCloseIcon.next(null)

            }

        });

        this.closeSubscription = this.storyListService.onFixedCloseClicked.subscribe(() => {
            this.close(null);
        })
    }


    close(event) {
        if(event){

            event && event.stopPropagation();
        }
        this.storyListService.onShowFixedCloseIcon.next(null);

        this.onClosed.emit();

        setTimeout(() => {
            this.storyListService.scrollTo.next(this.story);
        }, 0)
    }

    afterGetArticle() {

        this.currentStoryIndex = this.storyService.getStorySnapshot().indexOf(this.story);

    }

    ngOnDestroy(): void {
        this.storyListService.onShowFixedCloseIcon.next(null);

        this.subscription.unsubscribe();
        this.closeSubscription.unsubscribe();
    }
}
