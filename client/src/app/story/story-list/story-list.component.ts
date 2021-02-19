import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Observable, Subject } from 'rxjs';
import { pairwise, takeUntil, throttle } from 'rxjs/operators';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { IS_MOBILE } from 'src/app/shared/const';
import { StoryService } from '../../shared/story.service';
import { Story } from '../../../../../model/Story';
import { Config, ConfigService } from '../../shared/config.service';
import { LoadingEventName, LoadingEventType, LoadingService } from '../../shared/loading.service';
import { ArticleService } from '../../shared/article.service';
import StoryImage from '../../../../../model/StoryImage';
import StoryMeta from '../../../../../model/StoryMeta';
import { StoryComponent } from '../story/story.component';
import { IS_NODE } from './../../shared/const';
import { StoryListService } from './story-list.service';
import { DestroySubscriber } from './../../shared/destroy-subscriber';

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss'],
})
export class StoryListComponent extends DestroySubscriber implements OnInit {


    @ViewChild('scrollingBlock')
    public scrollingBlock: ElementRef;
    @ViewChildren(StoryComponent)
    public storyComponents: QueryList<StoryComponent>;

    public stories: Story[] = [];
    public openningStory: { id?: string; story?: Story; category?: string } = {};

    public category: string;
    public isShowMoveTop: boolean;
    public hideMoveTopTimeout;

    public searchKeyword: string;

    public isLoading = false;

    public config: Config;
    public isBrowser;


    public currentScrollIndex = 0;
    public loadingStoryNumber = [];
    protected buffer: Story[] = [];
    private readonly LOADING_STORY_NUMBER = 10;
    private selectedStory: Story;

    private $stopGetStories = new Subject();

    public constructor(protected storyService: StoryService,
        protected activatedRoute: ActivatedRoute,
        protected route: ActivatedRoute,
        protected router: Router,
        protected storyListService: StoryListService,
        @Inject(IS_MOBILE) public isSmallScreen: boolean,
        @Inject(IS_NODE) public isNode: boolean,
        protected configService: ConfigService,
        protected loadingService: LoadingService,
        protected articleService: ArticleService,
        protected scrollDispatcher: ScrollDispatcher,
    ) {
        super();
    }

    public async ngOnInit() {
        //Listen scroll for lazy load image
        // this.scrollDispatcher.scrolled().pipe(throttle(() => interval(1000))).subscribe(() => {
        //     window.dispatchEvent(new CustomEvent('scroll'));
        // });

        this.loadingStoryNumber = Array(this.LOADING_STORY_NUMBER).fill('');

        this.isBrowser = typeof window !== 'undefined';
        const params = this.route.children[0].snapshot?.params;
        this.openningStory = {
            id: params?.id,
            category: params?.category,
        };
        this.loadOpenningStory();

        if (!this.isNode) {
            if (this.openningStory.id) {
                // Delay loading story list to improve UX when first load
                this.isLoading = true;
                setTimeout(() => {
                    this.isLoading = false;
                    this.updateStoryList();
                }, 2000);
            } else {
                this.updateStoryList();
            }
            this.registerPrevAndNext();
            this.registerOnSearch();
            this.registerConfigChange();
            this.registerSpinner();
        }
    }

    public loadOpenningStory() {
        this.getFirstStory().subscribe((story) => {
            if (story === undefined) {
                return;
            }
            this.openningStory.story = story;
            this.openningStory.story.isAutoOpen = true;
            this.openningStory.story.isActive = true;
            this.selectStory(this.openningStory.id);
        });
    }
    public onSelectedStory(selectedStoryIndex: number) {
        if (this.selectedStory) {
            this.selectedStory.isActive = false;
        }
        this.selectedStory = this.stories[selectedStoryIndex];
        this.selectedStory.isActive = true;

    }



    public autoSelectFirstStory() {
        if (!this.isSmallScreen && !this.openningStory.id) {
            setTimeout(() => {
                this.storyComponents.first?.onSelectStory();
            });
        }
        this.afterInitStories();
    }

    public trackByFn(item) {
        return item.id;
    }

    public async loadMoreStories() {
        if (this.isNode) {
            return;
        }
        if (this.isLoading) {
            return;
        }
        this.isLoading = true;
        return new Promise((resolve) => {
            this.getLoadMoreObservable()
                .pipe(takeUntil(this.$stopGetStories), throttle(() => interval(10000)))
                .subscribe((value) => {
                    this.stories.push(...value);
                    this.isLoading = false;
                    resolve(true);
                });
        });
    }
    protected scrollTo(story: Story) {
        setTimeout(() => {
            const index = this.stories.findIndex((i) => i.id === story.id);
            const el = this.storyComponents.toArray()[Math.max(0, index)].getElement();
            this.scrollingBlock.nativeElement.scrollTo?.({ top: el.offsetTop, behavior: 'smooth' });
        });
    }

    protected scrollTop() {
        if (this.isNode) {
            return;
        }
        setTimeout(() => {
            this.scrollingBlock?.nativeElement?.scrollTo?.({ top: 0, behavior: 'smooth' });
        });

    }


    protected resetStoryList() {
        this.stories = [];
        const hasSwitchCategory = !this.openningStory.category || this.category !== this.openningStory.category;
        if (hasSwitchCategory) {
            this.openningStory = {};
            this.scrollTop();
        }
        this.storyService.resetPageNumber();
    }

    protected loadFirstPage() {
        this.isLoading = true;
        this.storyService.getStories(this.category, 10)
            .pipe(takeUntil(this.$stopGetStories)).subscribe((value) => {
                const stories: Story[] = value.filter((s) => s.id !== this.openningStory.id);
                this.stories.push(...stories);
                this.isLoading = false;
                this.autoSelectFirstStory();
            });
    }

    private afterInitStories() {
        if(!this.openningStory.id){
            this.scrollTop();
        }
    }

    private registerPrevAndNext() {
        this.storyListService.onSelectPrevStory.subscribe(() => {
            const prevIndex = this.stories.indexOf(this.storyListService.currentSelectedStory) - 1;
            if (prevIndex > -1) {
                const prevStoryId = this.stories[prevIndex].id;
                this.selectStory(prevStoryId);
            }

        });

        this.storyListService.onSelectNextStory.subscribe(() => {
            const nextIndex = this.stories.indexOf(this.storyListService.currentSelectedStory) + 1;
            const nextStoryId = this.stories[nextIndex].id;
            this.selectStory(nextStoryId);
        });
    }

    private selectStory(prevStoryId: string) {
        this.storyComponents?.forEach((story) => {
            if (story.story.id === prevStoryId) {
                story.onSelectStory();
                this.scrollTo(story.story);
            }
        });
    }

    private updateStoryList() {
        this.route.params.subscribe((params) => {
            this.$stopGetStories.next();

            this.category = params.category;
            this.resetStoryList();

            this.loadFirstPage();
            this.configService.updateConfig({ category: this.category });

        });
    }


    private getFirstStory(): Observable<Story> {
        return new Observable((observer) => {
            const params = this.route.children[0].snapshot?.params;
            if (params?.id) {
                const articleId = params.id;
                this.articleService.getById(articleId, params.category).subscribe((article) => {

                    const storyImage: StoryImage = new StoryImage(article.getThumbnail());
                    const storyMeta = new StoryMeta(article.sourceName, article.sourceIcon, article.time);
                    const story = new Story(articleId, article.header, null, [storyImage], article.externalUrl, storyMeta, false, true, true);
                    article.story = Object.assign(new Story(), story);
                    story.article = article;
                    observer.next(story);
                    observer.complete();
                });
            } else {
                observer.next();
                observer.complete();
            }


        });

    }

    private registerSpinner() {
        if (typeof window !== 'undefined') {
            this.loadingService.onLoading.subscribe((event) => {
                if (event.name === LoadingEventName.MORE_STORY) {
                    if (event.type === LoadingEventType.START) {
                        this.isLoading = true;
                    } else {
                        this.isLoading = false;
                    }
                }
            });
        }
    }

    private registerConfigChange() {
        this.configService.getConfig()
            .pipe(this.getTakeUntilDestroy(), pairwise())
            .subscribe(([oldConfig, newConfig]) => {
                this.config = newConfig;
                if (oldConfig.smallImage !== newConfig.smallImage) {
                    this.resetStoryList();
                    this.loadFirstPage();
                }
            });
    }


    private registerOnSearch() {
        this.storyService.onSearch.subscribe((keyword) => {
            if (keyword) {
                this.resetStoryList();
                this.storyService.search(keyword).subscribe((values) => this.stories.push(...values));
            } else {
                this.updateStoryList();
            }
            this.searchKeyword = keyword;

        });
    }




    private getLoadMoreObservable(): Observable<Story[]> {
        const category = this.route.firstChild.snapshot.paramMap.get('category');
        return this.searchKeyword ? this.storyService.search(this.searchKeyword) : this.storyService.getStories(category);
    }

}
