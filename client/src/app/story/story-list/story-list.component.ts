import {Component, OnInit, ViewChild} from '@angular/core';
import {StoryService} from "../../shared/story.service";
import {Story} from '../../../../../model/Story';
import {ActivatedRoute} from "@angular/router";
import {IPageInfo, VirtualScrollerComponent} from "ngx-virtual-scroller";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {ConfigService} from "../../shared/config.service";
import {ScrollEvent, StoryListService} from "./story-list.service";

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
    isListeningScroll = true;

    viewPortInfo:IPageInfo

    constructor(private storyService: StoryService,
                private route: ActivatedRoute,
                private storyListService: StoryListService,
                private breakpointService: BreakpointDetectorService,
                private configService: ConfigService) {
    }

    ngOnInit() {
        this.updateStoryList();
        this.registerScrollTo();
        this.handleCloseIcon();
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.registerShowingMoveToTop();

    }

    private registerShowingMoveToTop() {
        this.storyListService.onScrollUp.subscribe((value) => {
            if (value.startIndex > 0) {

                this.isShowMoveTop = true;
                clearTimeout(this.hideMoveTopTimeout);
                this.hideMoveTopTimeout = setTimeout(() => {
                    this.isShowMoveTop = false;
                }, 5000)
            }

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
        this.isListeningScroll = false;
        this.route.params.subscribe(params => {
            this.category = params['category'];

            this.loadFirstPage();
            this.configService.updateConfig({category: this.category})

            setTimeout(() => this.isListeningScroll = true, 1000)
        });
    }

    private loadFirstPage(): Promise<any> {

        return new Promise(resolver => {

            this.scrollToTop();
            this.storyService.resetPageNumber();
            this.storyService.getStories(this.category).subscribe(value => {
                this.stories = value;
                resolver();
            });
        })

    }

    private scrollToTop() {
        if (this.virtualScroller) {
            this.scrollTo(this.stories[0]);
        }
    }

    onCloseFn() {
        this.storyListService.onFixedCloseClicked.next(this.openStory)
    }

    vsEnd(event: ScrollEvent) {
        this.onLoadMore(event)
    }

    vsUpdate(event: ScrollEvent) {
        this.storyListService.onScroll.next()
        this.storyListService.vsScroll.next(this.virtualScroller.viewPortInfo)

    }



    private registerScrollTo() {
        this.storyListService.scrollTo.subscribe(item => {
            const index = this.stories.findIndex(i => i.id === item.id);
            this.virtualScroller.items = this.stories;
            this.scrollTo(this.stories[index], 500);
            this.virtualScroller.invalidateCachedMeasurementAtIndex(index)
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

    private scrollTo(story: Story, animation = 0) {
        this.virtualScroller.scrollInto(story, true, 0, 500, () => {
        })
    }


    moveTop(event: MouseEvent) {
        event.stopPropagation();
        this.loadFirstPage().then(() => {
            setTimeout(() => this.isShowMoveTop = false, 100)
        });

    }

    compare(a: Story, b: Story): boolean {
        return a.id === b.id;
    }

    onSelectedStory(story: Story) {
        setTimeout(() => {
            this.virtualScroller.invalidateCachedMeasurementForItem(story);
        }, 2000)
    }
}
