import {Component, OnInit, ViewChild} from '@angular/core';
import {StoryService} from "../../shared/story.service";
import {Story} from '../../../../../model/Story';
import {ActivatedRoute, Router} from "@angular/router";
import {IPageInfo, VirtualScrollerComponent} from "ngx-virtual-scroller";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {Config, ConfigService} from "../../shared/config.service";
import {StoryListService} from "./story-list.service";
import {Observable} from "rxjs";
import {LoadingEventName, LoadingEventType, LoadingService} from "../../shared/loading.service";
import * as url from 'speakingurl';

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {

    stories: Story[];

    category: string;
    protected buffer: Story[] = [];
    @ViewChild(VirtualScrollerComponent)
    private virtualScroller: VirtualScrollerComponent;


    isSmallScreen: boolean;
    isShowMoveTop: boolean;
    hideMoveTopTimeout;

    searchKeyword: string;

    isLoading = false;

    config: Config;

    constructor(private storyService: StoryService,
                private activatedRoute: ActivatedRoute,
                private route: ActivatedRoute,
                private router: Router,
                private storyListService: StoryListService,
                private breakpointService: BreakpointDetectorService,
                private configService: ConfigService,
                private loadingService: LoadingService) {
    }

    ngOnInit() {
        this.updateStoryList();
        this.registerScrollTo();
        this.isSmallScreen = this.breakpointService.isSmallScreen;
        this.registerShowingMoveToTop();

        this.search();

        this.configService.configUpdated.subscribe(config => {
            this.config = config.new;
            if (config.old.smallImage !== config.new.smallImage) {

                this.reloadStoryList()
            }
        })

        this.loadingService.onLoading.subscribe(event => {
            if (event.name == LoadingEventName.MORE_STORY) {
                if (event.type === LoadingEventType.START) {

                    this.isLoading = true
                } else {
                    setTimeout(() => this.isLoading = false, 2000)
                }
            }
        })

    }


    private reloadStoryList() {
        this.stories = [];
        this.storyService.resetPageNumber();
    }

    private search() {
        this.storyService.onSearch.subscribe(keyword => {
            if (keyword) {

                this.storyService.resetPageNumber();
                this.storyService.search(keyword).subscribe(values => this.stories = values)
            } else {
                this.updateStoryList();
            }
            this.searchKeyword = keyword;

        })
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


    private updateStoryList() {
        if (this.isLoading) return;
        this.route.params.subscribe(params => {
            this.category = params['category'];

            this.loadFirstPage();
            this.configService.updateConfig({category: this.category})

        });
    }

    private loadFirstPage() {
        this.scrollToTop();
        this.storyService.resetPageNumber();
        this.storyService.getStories(this.category).subscribe(value => {
            this.stories = value;
            this.autoSelectFirstStory(this.stories[0]);
        });
    }

    private scrollToTop() {
        if (this.virtualScroller) {
            this.scrollTo(this.stories[0], 500,);
        }
    }


    private registerScrollTo() {
        this.storyListService.scrollTo.subscribe(item => {
            const index = this.stories.findIndex(i => i.id === item.id);
            this.virtualScroller.items = this.stories;
            this.scrollTo(this.stories[index], 500);
            this.virtualScroller.invalidateCachedMeasurementForItem(this.stories[index])
        })
    }

    private onLoadMore(event: IPageInfo) {
        if (event.endIndex !== this.stories.length - 1 || this.isLoading) return;


        this.getLoadMoreObservable().subscribe(value => {

            this.stories = value;
        });


    }

    private getLoadMoreObservable() {
        let loadMorePromise: Observable<Story[]>;
        loadMorePromise = this.searchKeyword ? this.storyService.search(this.searchKeyword) : this.storyService.getStories(this.category);
        return loadMorePromise;
    }

    private scrollTo(story: Story, animation = 0, callback = null) {
        this.virtualScroller.scrollInto(story, true, -60, animation, callback);
    }


    moveTop(event: MouseEvent) {
        event.stopPropagation();
        this.virtualScroller.scrollToIndex(0, true, 0, 500,);
        setTimeout(this.reloadStoryList.bind(this), 600)

    }



    vsEnd() {
        this.onLoadMore(this.virtualScroller.viewPortInfo)

    }

    vsUpdate() {
        this.storyListService.onScroll.next(this.virtualScroller.viewPortInfo);

    }

    private autoSelectFirstStory(story: Story) {
        if (!this.isSmallScreen && !this.activatedRoute.snapshot.firstChild.params['id']) {

            this.router.navigate([url(story.title), story.id], {relativeTo: this.route})
        }

    }

    compareItem(a: Story, b: Story) {
        return a!=null && b!=null && a.id === b.id

    }
}
