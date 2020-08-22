import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { StoryService } from "../../shared/story.service";
import { Story } from '../../../../../model/Story';
import { ActivatedRoute, Router } from "@angular/router";
import { BreakpointDetectorService } from "../../shared/breakpoint.service";
import { Config, ConfigService } from "../../shared/config.service";
import { StoryListService } from "./story-list.service";
import { LoadingEventName, LoadingEventType, LoadingService } from "../../shared/loading.service";
import { ArticleService } from "../../shared/article.service";
import StoryImage from "../../../../../model/StoryImage";
import StoryMeta from "../../../../../model/StoryMeta";
import RequestAnimationFrame from "../../requestAnimationFrame.cons";
import { StoryComponent } from "../story/story.component";
import { Observable, Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {

    stories: Story[] = [];

    category: string;
    protected buffer: Story[] = [];


    @ViewChild("scrollingBlock",{static:false})
    scrollingBlock:ElementRef;
    @ViewChildren(StoryComponent)
    storyComponents: QueryList<StoryComponent>; 

    isSmallScreen: boolean;
    isShowMoveTop: boolean;
    hideMoveTopTimeout;

    searchKeyword: string;

    isLoading = false;

    config: Config;
    isBrowser;

    firstStory: Story;
    currentScrollIndex = 0;
    loadingStoryNumber = [];
    private readonly LOADING_STORY_NUMBER = 10;
    private readonly LOADMORE_THRESHOLD = 10;
    private firstStoriesLoaderPromise: any;
    private selectedStory: Story;

    private $stopGetStories = new Subject();


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
        this.loadingStoryNumber = Array(this.LOADING_STORY_NUMBER).fill("");

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

        this.registerPrevAndNext();

    }
    onSelectedStory(selectedStoryIndex: number) {
        console.log('onselec')
        if (this.selectedStory) {
            this.selectedStory.isActive = false;
        }
        this.selectedStory = this.stories[selectedStoryIndex];
        this.selectedStory.isActive = true;

    }
    private registerPrevAndNext() {
        this.storyListService.onSelectPrevStory.subscribe(() => {
            let prevIndex = this.stories.indexOf(this.storyListService.currentSelectedStory) - 1;
            if (prevIndex > -1) {
                let prevStoryId = this.stories[prevIndex].id;
                this.selectStory(prevStoryId);
            }

        });

        this.storyListService.onSelectNextStory.subscribe(() => {
            let nextIndex = this.stories.indexOf(this.storyListService.currentSelectedStory) + 1;
            let nextStoryId = this.stories[nextIndex].id;
            this.selectStory(nextStoryId);
        })
    }

    private selectStory(prevStoryId: string) {
        this.storyComponents.forEach(story => {
            if (story.story.id === prevStoryId) {
                story.onSelectStory();
                this.scrollTo(story.story, 500, 0);
            }
        });
    }

    private updateStoryList() {
        if (this.isLoading) return;
        this.route.params.subscribe(params => {
            this.$stopGetStories.next();
            this.firstStoriesLoaderPromise && this.firstStoriesLoaderPromise.unsubscribe();

            this.resetStoryList();
            this.category = params['category'];

            this.loadFirstPage();
            this.configService.updateConfig({ category: this.category })

        });
    }


    private getFirstStory(): Promise<Story> {
        return new Promise((resolve, reject) => {
            let params = this.route.children[0].snapshot.params;
            if (params["id"]) {
                let articleId = params["id"];
                this.articleService.getById(articleId, params['category']).then(article => {

                    let storyImage: StoryImage = new StoryImage(article.images[0]);
                    let storyMeta = new StoryMeta(article.sourceName, article.sourceIcon, article.time);
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
        this.scrollTop();
    }

    private registerOnSearch() {
        this.storyService.onSearch.subscribe(keyword => {
            if (keyword) {
                this.resetStoryList();
                this.storyService.search(keyword).subscribe(values => this.stories.push(...values))
            } else {
                this.updateStoryList();
            }
            this.searchKeyword = keyword;

        })
    }


    private loadFirstPage() {
        this.storyService.getStories(this.category).pipe(takeUntil(this.$stopGetStories)).subscribe(value => {
            this.stories.push(...value);
            if (this.firstStory) {
                this.addFirstStoryToTheTop();
                this.firstStory = null;
            }
            this.autoSelectFirstStory();
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
        this.stories[0].isActive = true;
        this.selectStory(this.firstStory.id);
    }


    protected async loadMoreStories(){
        this.isLoading = true;
        return  new Promise(resolve=>{
            this.getLoadMoreObservable().pipe(takeUntil(this.$stopGetStories)).subscribe(value => {
                this.stories.push(...value);
                this.isLoading = false;
                resolve()
            });
        }) 
    }

    private getLoadMoreObservable():Observable<Story[]> {
        let loadMorePromise: Observable<Story[]>;
        loadMorePromise = this.searchKeyword ? this.storyService.search(this.searchKeyword) : this.storyService.getStories(this.category);
        return loadMorePromise;
    }

    protected scrollTo(story: Story, animation = 500, offset = -60) {
        setTimeout(() => {
            const index = this.stories.findIndex(i => i.id === story.id);
            console.log(index)
            const el =this.storyComponents.toArray()[Math.max(0, index)].getElement();
            this.scrollingBlock.nativeElement.scrollTo({top:el.offsetTop,behavior:'smooth'})
        }, 0);    


    }
    protected scrollTop(){
        this.scrollingBlock.nativeElement.scrollTo({top:0,behavior:'smooth'});

    }


    moveTop(event: MouseEvent) {
        event.stopPropagation();
        this.scrollTop();
        RequestAnimationFrame(() => {
            this.resetStoryList();
            this.loadFirstPage();

        })

    }

    autoSelectFirstStory() {
        if (!this.isSmallScreen && !this.activatedRoute.snapshot.firstChild.params['id']) {
            RequestAnimationFrame(() => {
                this.storyComponents.first.onSelectStory();
            }, 100)
        }
        this.scrollTop();
        this.afterInitStories();


    }
    protected afterInitStories(){

    }

    compareItem(a: Story, b: Story) {
        return a != null && b != null && a.id === b.id

    }

}
