import {Component, OnInit, ViewChild} from '@angular/core';
import {StoryService} from "../../shared/story.service";
import {Story} from '../../../../../model/Story';
import {ActivatedRoute} from "@angular/router";
import {ScrollEvent, StoryListService} from "../../shared/story-list.service";
import {VirtualScrollerComponent} from "ngx-virtual-scroller";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {NavigatorService} from "../../navigator/navigator.service";

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {

    stories: Story[];
    isLoadingMore = false;

    category: string;
    protected buffer: Story[] = [];
    @ViewChild(VirtualScrollerComponent)
    private virtualScroller: VirtualScrollerComponent;

    isShowFixedCloseIcon = false;

    openStory: Story;
    isSmallScreen: boolean;
    isShowMoveTop: boolean;


    hideMoveTopTimeout;

    constructor(private storyService: StoryService,
                private route: ActivatedRoute,
                private storyListService: StoryListService,
                private breakpointService: BreakpointDetectorService,
                private navigatorService: NavigatorService) {
    }

    ngOnInit() {
        this.updateStoryList();
        this.registerScrollTo();
        this.handleCloseIcon();
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.storyListService.onScrollUp.subscribe(() => {
            this.isShowMoveTop = true;
            clearTimeout(this.hideMoveTopTimeout)
            this.hideMoveTopTimeout = setTimeout(() => {
                this.isShowMoveTop = false;
            }, 5000)

        })

    }

    private handleCloseIcon() {
        this.storyListService.onShowFixedCloseIcon.subscribe(isShow => {
            if (isShow) {
                this.isShowFixedCloseIcon = true;
                this.openStory = isShow
            } else {
                this.isShowFixedCloseIcon = false;
            }
        })
    }

    private updateStoryList() {
        this.route.params.subscribe(params => {
            this.category = params['category'];
            this.loadFirstPage();

        });
    }

    private loadFirstPage() {
        this.scrollToTop();
        this.storyService.resetPageNumber();
        this.storyService.getStories(this.category).subscribe(value => {
            this.stories = value;

            this.navigatorService.onShowHeader.next();
        });
    }

    private scrollToTop() {
        if (this.virtualScroller) {

            this.virtualScroller.scrollToIndex(0);
        }
    }

    onCloseFn() {
        this.storyListService.onFixedCloseClicked.next(this.openStory)
    }

    vsEnd(event: ScrollEvent) {
        this.onLoadMore(event)
    }

    vsUpdate(event: ScrollEvent) {
        this.storyListService.onScroll.next(event)

    }

    vsChange(event: ScrollEvent) {
        this.storyListService.vsScroll.next(event)

    }

    private registerScrollTo() {
        this.storyListService.scrollTo.subscribe(item => {
            const index = this.stories.findIndex(i => i.id === item.id);
            this.virtualScroller.items = this.stories;
            this.virtualScroller.scrollInto(this.stories[index], true, 0, 1000);
        })
    }

    private onLoadMore(event: ScrollEvent) {
        if (event.end !== this.stories.length - 1) return;

        if (!this.isLoadingMore) {
            this.isLoadingMore = true;
            this.storyService.getStories(this.category).subscribe(value => {
                this.isLoadingMore = false;
                this.stories = value;
            });
        }


    }


    moveTop(event: MouseEvent) {
        event.stopPropagation();
        this.loadFirstPage();

    }
}
