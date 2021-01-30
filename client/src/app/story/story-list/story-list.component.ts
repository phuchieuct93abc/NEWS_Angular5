import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Observable, Subject } from 'rxjs';
import { takeUntil, throttle } from 'rxjs/operators';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { StoryService } from '../../shared/story.service';
import { Story } from '../../../../../model/Story';
import { BreakpointDetectorService } from '../../shared/breakpoint.service';
import { Config, ConfigService } from '../../shared/config.service';
import { LoadingEventName, LoadingEventType, LoadingService } from '../../shared/loading.service';
import { ArticleService } from '../../shared/article.service';
import StoryImage from '../../../../../model/StoryImage';
import StoryMeta from '../../../../../model/StoryMeta';
import RequestAnimationFrame from '../../requestAnimationFrame.cons';
import { StoryComponent } from '../story/story.component';
import { StoryListService } from './story-list.service';

@Component({
    selector: 'app-story-list',
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.scss'],
})
export class StoryListComponent implements OnInit {


    @ViewChild('scrollingBlock',{static:false})
    public scrollingBlock: ElementRef;
    @ViewChildren(StoryComponent)
    public storyComponents: QueryList<StoryComponent>;

    public stories: Story[] = [];

    public category: string;
    public isSmallScreen: boolean;
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
    private readonly LOADMORE_THRESHOLD = 10;
    private selectedStory: Story;

    private $stopGetStories = new Subject();


    public constructor(protected storyService: StoryService,
        protected activatedRoute: ActivatedRoute,
        protected route: ActivatedRoute,
        protected router: Router,
        protected storyListService: StoryListService,
        protected breakpointService: BreakpointDetectorService,
        protected configService: ConfigService,
        protected loadingService: LoadingService,
        protected articleService: ArticleService,
        protected scrollDispatcher: ScrollDispatcher,
        ) {

    }

    public async ngOnInit() {
        //Listen scroll for lazy load image
        this.scrollDispatcher.scrolled().subscribe(() => {
            window.dispatchEvent(new CustomEvent('scroll'));
        });

        this.loadingStoryNumber = Array(this.LOADING_STORY_NUMBER).fill('');

        this.isBrowser = typeof window !== 'undefined';
        this.isSmallScreen = this.breakpointService.isSmallScreen;

        this.registerOnSearch();

        this.registerConfigChange();

        this.registerSpinner();

        this.getFirstStory().subscribe((firstStory) => {
            this.firstStory = firstStory;
            this.updateStoryList();
        });


        this.registerPrevAndNext();

    }
    public onSelectedStory(selectedStoryIndex: number) {
        if (this.selectedStory) {
            this.selectedStory.isActive = false;
        }
        this.selectedStory = this.stories[selectedStoryIndex];
        this.selectedStory.isActive = true;

    }

    protected async loadMoreStories(){
        if(this.isLoading){
            return;
        }
        this.isLoading = true;
        return  new Promise((resolve)=>{
            this.getLoadMoreObservable()
            .pipe(takeUntil(this.$stopGetStories),throttle((val) => interval(10000)))
            .subscribe((value) => {
                console.log(value)
                this.stories.push(...value);
                this.isLoading = false;
                resolve(true);
            });
        });
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
        this.storyComponents.forEach((story) => {
            if (story.story.id === prevStoryId) {
                story.onSelectStory();
                this.scrollTo(story.story, 500, 0);
            }
        });
    }

    private updateStoryList() {
        this.route.params.subscribe((params) => {
            console.log('get story');
            this.$stopGetStories.next();

            this.resetStoryList();
            this.category = params.category;

            this.loadFirstPage();
            this.configService.updateConfig({ category: this.category });

        });
    }


    private getFirstStory(): Observable<Story> {
        return new Observable((observer) => {
            const params = this.route.children[0].snapshot.params;
            if (params.id) {
                const articleId = params.id;
                this.articleService.getById(articleId, params.category).subscribe((article) => {

                    const storyImage: StoryImage = new StoryImage(article.images[0]);
                    const storyMeta = new StoryMeta(article.sourceName, article.sourceIcon, article.time);
                    const story = new Story(articleId, article.header, null, [storyImage], article.externalUrl, storyMeta, false, true, true);
                    observer.next(story);
                });
            } else {
                observer.next();
            }


        });

    }

    private registerSpinner() {
        if (typeof window !== 'undefined') {

            this.loadingService.onLoading.subscribe((event) => {
                if (event.name == LoadingEventName.MORE_STORY) {
                    if (event.type === LoadingEventType.START) {

                        this.isLoading = true;
                    } else {

                        setTimeout(() => RequestAnimationFrame(() => {
                            this.isLoading = false;
                        }), 2000);
                    }
                }
            });
        }
    }

    private registerConfigChange() {
        this.configService.configUpdated.subscribe((config) => {
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

        this.storyService.getStories(this.category,10).pipe(takeUntil(this.$stopGetStories)).subscribe((value) => {
            this.stories.push(...value);
            if (this.firstStory) {
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
        let loadMorePromise: Observable<Story[]>;
        loadMorePromise = this.searchKeyword ? this.storyService.search(this.searchKeyword) : this.storyService.getStories(category);
        return loadMorePromise;
    }

    protected scrollTo(story: Story, animation = 500, offset = -60) {
        setTimeout(() => {
            const index = this.stories.findIndex((i) => i.id === story.id);
            const el =this.storyComponents.toArray()[Math.max(0, index)].getElement();
            this.scrollingBlock.nativeElement.scrollTo({top:el.offsetTop,behavior:'smooth'});
        }, 0);


    }
    protected scrollTop(){
        this.scrollingBlock && this.scrollingBlock.nativeElement.scrollTo({top:0,behavior:'smooth'});

    }


    moveTop(event: MouseEvent) {
        event.stopPropagation();
        this.scrollTop();
        RequestAnimationFrame(() => {
            this.resetStoryList();
            this.loadFirstPage();

        });

    }

    autoSelectFirstStory() {
        if (!this.isSmallScreen && !this.activatedRoute.snapshot.firstChild.params.id) {
            RequestAnimationFrame(() => {
                this.storyComponents.first.onSelectStory();
            }, 100);
        }

        this.afterInitStories();


    }
    protected afterInitStories(){
        setTimeout(() => {
            this.scrollTop();

        });

    }

    compareItem(a: Story, b: Story) {
        return a != null && b != null && a.id === b.id;

    }

}
