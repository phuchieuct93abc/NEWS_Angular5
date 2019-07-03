import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {StoryService} from "../../shared/story.service";
import {Story} from '../../../../../model/Story';
import {ActivatedRoute, Router} from "@angular/router";
import {IPageInfo, VirtualScrollerComponent} from "ngx-virtual-scroller";
import {BreakpointDetectorService} from "../../shared/breakpoint.service";
import {Config, ConfigService} from "../../shared/config.service";
import {StoryListService} from "./story-list.service";
import {LoadingEventName, LoadingEventType, LoadingService} from "../../shared/loading.service";
import * as url from 'speakingurl';
import {ArticleService} from "../../shared/article.service";
import StoryImage from "../../../../../model/StoryImage";
import StoryMeta from "../../../../../model/StoryMeta";
import RequestAnimationFrame from "../../requestAnimationFrame.cons";
import {StoryComponent} from "../story/story.component";

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {

    stories: Story[] = [];

    category: string;
    protected buffer: Story[] = [];
    @ViewChild(VirtualScrollerComponent, {static: false})
    protected virtualScroller: VirtualScrollerComponent;

    @ViewChildren('story')
    storyComponents:QueryList<StoryComponent>;

    isSmallScreen: boolean;
    isShowMoveTop: boolean;
    hideMoveTopTimeout;

    searchKeyword: string;

    isLoading = false;

    config: Config;
    isBrowser;

    firstStory: Story;
    isListeningScroll = true;
    currentScrollIndex = 0;
    private readonly LOADMORE_THRESHOLD = 10;


    constructor(protected storyService: StoryService,
                protected activatedRoute: ActivatedRoute,
                protected route: ActivatedRoute,
                protected router: Router,
                protected storyListService: StoryListService,
                protected breakpointService: BreakpointDetectorService,
                protected configService: ConfigService,
                protected loadingService: LoadingService,
                protected articleService: ArticleService) {
    }

    async ngOnInit() {
        this.isBrowser = typeof window !== 'undefined';
        this.isSmallScreen = this.breakpointService.isSmallScreen;

        this.registerOnSearch();

        this.registerConfigChange();

        this.registerSpinner();

        this.getFirstStory().then(firstStory => {
            this.firstStory = firstStory;
        }).finally(() => {
            this.updateStoryList();
        });

        this.storyListService.onSelectPrevStory.subscribe(()=>{
            let prevIndex = this.stories.indexOf(this.storyListService.currentSelectedStory)-1;
            let prevStoryId = this.stories[prevIndex].id;
            this.storyComponents.forEach(story=>{
                if(story.story.id === prevStoryId){
                    story.onSelectStory();
                    this.scrollTo(story.story,500,0);
                }
            })
        });

        this.storyListService.onSelectNextStory.subscribe(()=>{
            let nextIndex = this.stories.indexOf(this.storyListService.currentSelectedStory)+1;
            let nextStoryId = this.stories[nextIndex].id;
            this.storyComponents.forEach(story=>{
                if(story.story.id === nextStoryId){
                    story.onSelectStory();
                    this.scrollTo(story.story,500,0);

                }
            })
        })

    }
    private updateStoryList() {
        if (this.isLoading) return;
        this.route.params.subscribe(params => {
            this.resetStoryList();
            this.category = params['category'];

            this.loadFirstPage();
            this.configService.updateConfig({category: this.category})

        });
    }


    private getFirstStory(): Promise<Story> {
        return new Promise((resolve, reject) => {
            let params = this.route.children[0].snapshot.params;
            if (params["id"]) {
                let articleId = params["id"];
                this.articleService.getById(articleId, params['category']).then(article => {

                    let storyImage: StoryImage = new StoryImage(article.images[0]);
                    let storyMeta = new StoryMeta(article.sourceName, article.time);
                    let story = new Story(articleId, article.header, null, [storyImage], article.externalUrl, storyMeta, false, true, true);
                    resolve(story)
                })
            } else {
                reject();
            }


        })

    }

    private registerSpinner() {
        if (typeof window !== 'undefined') {

            this.loadingService.onLoading.subscribe(event => {
                if (event.name == LoadingEventName.MORE_STORY) {
                    if (event.type === LoadingEventType.START) {

                        this.isLoading = true
                    } else {

                        setTimeout(() => RequestAnimationFrame(() => {
                            this.isLoading = false
                        }), 2000)
                    }
                }
            })
        }
    }

    private registerConfigChange() {
        this.configService.configUpdated.subscribe(config => {
            this.config = config.new;
            if (config.old.smallImage !== config.new.smallImage) {
                this.resetStoryList();
                this.loadFirstPage();
            }
        });
    }

    private resetStoryList() {
        this.stories = [];
        this.storyService.resetPageNumber();
        this.scrollToTop();
    }

    private registerOnSearch() {
        this.storyService.onSearch.subscribe(keyword => {
            if (keyword) {
                this.resetStoryList();
                this.storyService.search(keyword).then(values => this.stories.push(...values))
            } else {
                this.updateStoryList();
            }
            this.searchKeyword = keyword;

        })
    }




    private loadFirstPage() {
        this.storyService.getStories(this.category).then(value => {
            this.stories.push(...value);
            if (this.firstStory) {
                this.addFirstStoryToTheTop();
                this.firstStory = null;
            }
            this.autoSelectFirstStory(this.stories[0]);
        });
    }

    private addFirstStoryToTheTop() {
        let firstStoryIndex = this.stories.findIndex(story => story.id === this.firstStory.id);
        if (firstStoryIndex !== -1) {
            let temp = this.stories[0];
            this.stories[0] = this.stories[firstStoryIndex];
            this.stories[firstStoryIndex] = temp
        } else {
            this.stories.unshift(this.firstStory);
            this.storyService.unshift(this.firstStory);

        }
        this.stories[0].isAutoOpen = true;
    }

    private scrollToTop() {
        if (this.virtualScroller) {
            this.scrollTo(this.stories[0], 500);
        }
    }


    private onLoadMore(event: IPageInfo) {
        if (event.endIndex < this.stories.length - this.LOADMORE_THRESHOLD || this.isLoading) return;
        this.isLoading = true;
        this.getLoadMoreObservable().then(value => {
            this.stories.push(...value);
            this.isLoading = false;
        });
    }

    private getLoadMoreObservable() {
        let loadMorePromise: Promise<Story[]>;
        loadMorePromise = this.searchKeyword ? this.storyService.search(this.searchKeyword) : this.storyService.getStories(this.category);
        return loadMorePromise;
    }

    protected scrollTo(story: Story, animation = 500,offset=-60) {
        this.isListeningScroll = false;

        this.virtualScroller.scrollInto(story, true, offset, animation, () => {

                setTimeout(() => RequestAnimationFrame(() => this.isListeningScroll = true), 500)
            }
        );
    }


    moveTop(event: MouseEvent) {
        event.stopPropagation();
        this.virtualScroller.scrollToIndex(0, true, -60, 500);
        RequestAnimationFrame(() => {
            this.resetStoryList();
            this.loadFirstPage();

        })

    }


    vsEnd() {
        this.onLoadMore(this.virtualScroller.viewPortInfo)

    }

    vsUpdate() {
        this.currentScrollIndex = this.virtualScroller.viewPortInfo.startIndex;
        this.storyListService.onScroll.next(this.virtualScroller.viewPortInfo);

    }

    autoSelectFirstStory(story: Story) {
        if (!this.isSmallScreen && !this.activatedRoute.snapshot.firstChild.params['id']) {
            this.router.navigate([url(story.title), story.id], {relativeTo: this.route})
        }

    }

    compareItem(a: Story, b: Story) {
        return a != null && b != null && a.id === b.id

    }

}
