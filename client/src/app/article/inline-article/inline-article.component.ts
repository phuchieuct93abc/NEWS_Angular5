import {ArticleComponent} from "../article.component";
import {ActivatedRoute} from "@angular/router";
import {ArticleService} from "../../shared/article.service";
import {Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";
import {Story} from "../../../../../model/Story";
import {StoryService} from "../../shared/story.service";
import {StoryListService} from "../../story/story-list/story-list.service";
import {CdkDrag} from "@angular/cdk/drag-drop";

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

    @Input()
    story: Story;

    currentStoryIndex: number;
    isFadingRight = false;
    isFadingLeft = false;

    constructor(protected route: ActivatedRoute,
                protected articleService: ArticleService,
                private storyListService: StoryListService,
                private storyService: StoryService) {
        super(route, articleService)
    }


    ngOnInit() {

        this.showArticleById(this.story.id);

    }


    close(event) {
        if (event) {

            event && event.stopPropagation();
        }
        this.storyListService.scrollTo.next(this.story);


        setTimeout(() => {
            this.onClosed.emit();
        }, 500);
    }

    afterGetArticle() {
        this.currentStoryIndex = this.storyService.getStorySnapshot().indexOf(this.story);
    }

    ngOnDestroy(): void {
    }

    swipeleft($event) {

        this.isFadingLeft = true;
        setTimeout(() => {
            this.close(null);
        }, 500)

    }

    swiperight($event) {
        this.isFadingRight = true;
        setTimeout(() => {

            this.close(null);
        }, 500)
    }
}
