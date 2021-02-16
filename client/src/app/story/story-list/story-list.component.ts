import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, interval, Observable, Subject } from 'rxjs';
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
import RequestAnimationFrame from '../../requestAnimationFrame.cons';
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

    public category: string;
    public isShowMoveTop: boolean;
    public hideMoveTopTimeout;

    public searchKeyword: string;

    public isLoading = false;

    public config: Config;
    public isBrowser;

    public firstStory: Story;
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
        this.scrollDispatcher.scrolled().subscribe(() => {
            window.dispatchEvent(new CustomEvent('scroll'));
        });

        this.loadingStoryNumber = Array(this.LOADING_STORY_NUMBER).fill('');

        this.isBrowser = typeof window !== 'undefined';

        this.registerOnSearch();

        this.registerConfigChange();

        this.registerSpinner();


        this.updateStoryList();



        this.registerPrevAndNext();

    }
    public onSelectedStory(selectedStoryIndex: number) {
        if (this.selectedStory) {
            this.selectedStory.isActive = false;
        }
        this.selectedStory = this.stories[selectedStoryIndex];
        this.selectedStory.isActive = true;

    }

    public moveTop(event: MouseEvent) {
        event.stopPropagation();
        this.scrollTop();
        RequestAnimationFrame(() => {
            this.resetStoryList();
            this.loadFirstPage();
        });
    }

    public autoSelectFirstStory() {
        // setTimeout(() => {
        //     this.storyComponents.first?.onSelectStory();
           
        // });
        this.afterInitStories();
    }
    public compareItem(a: Story, b: Story) {
        return a != null && b != null && a.id === b.id;

    }

    public async loadMoreStories() {
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
        }, 0);
    }

    protected scrollTop(){
      
  this.scrollingBlock?.nativeElement?.scrollTo?.({ top: 0, behavior: 'smooth' });
        window?.dispatchEvent(new CustomEvent('scroll'));

    }

    protected afterInitStories() {
        setTimeout(() => {
            this.scrollTop();
        }, 100);

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

            this.resetStoryList();
            this.category = params.category;

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

    private resetStoryList() {
        this.stories = [];
        this.storyService.resetPageNumber();
        setTimeout(this.scrollTop.bind(this));
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


    private loadFirstPage() {
        forkJoin([this.getFirstStory(), this.storyService.getStories(this.category, 10)])
        .pipe(takeUntil(this.$stopGetStories)).subscribe(([fistStory, value]) => {
            this.firstStory = fistStory;
                this.stories.push(...value);
                if (this.firstStory) {
                    this.firstStory.isOpenning = true;
                    this.addFirstStoryToTheTop();
                    this.firstStory = null;
                }
                this.autoSelectFirstStory();
            });
    }

    private addFirstStoryToTheTop() {
        const firstStoryIndex = this.stories.findIndex((story) => story.id === this.firstStory.id);
        if (firstStoryIndex !== -1) {
            const temp = this.stories[0];
            this.stories[0] = this.stories[firstStoryIndex];
            this.stories[firstStoryIndex] = temp;
        } else {
            this.stories.unshift(this.firstStory);
            this.storyService.unshift(this.firstStory);

        }
        this.stories[0].isAutoOpen = true;
        this.stories[0].isActive = true;
        this.selectStory(this.firstStory.id);
    }


    private getLoadMoreObservable(): Observable<Story[]> {
        const category = this.route.firstChild.snapshot.paramMap.get('category');
        return this.searchKeyword ? this.storyService.search(this.searchKeyword) : this.storyService.getStories(category);
    }


}
