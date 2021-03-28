import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { pairwise, takeUntil, throttle } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import { DestroySubscriber } from 'src/app/shared/destroy-subscriber';
import { StoryService } from '../../shared/story.service';
import { Story } from '../../../../../model/Story';
import { Config, ConfigService } from '../../shared/config.service';
import { LoadingEventName, LoadingEventType, LoadingService } from '../../shared/loading.service';
import { ArticleService } from '../../shared/article.service';
import StoryImage from '../../../../../model/StoryImage';
import StoryMeta from '../../../../../model/StoryMeta';
import { StoryComponent } from '../story/story.component';
import { StoryListService } from '../story-list/story-list.service';
import { StoryListComponent } from '../story-list/story-list.component';
import { IS_NODE } from './../../shared/const';
@Component({
  selector: 'app-story-list-management',
  templateUrl: './story-list-management.component.html',
  styleUrls: ['./story-list-management.component.scss']
})
export class StoryListManagementComponent extends DestroySubscriber implements OnInit {


  @ViewChild('scrollingBlock')
  public scrollingBlock: ElementRef<HTMLElement>;
  @ViewChildren(StoryComponent)
  public storyComponents: QueryList<StoryComponent>;

  @ViewChild(StoryListComponent)
  public storyList: StoryListComponent;

  public stories$ =new BehaviorSubject<Story[]>([]);

  public openningStory: { id?: string; story?: Story; category?: string } = {};

  public category: string;
  public isShowMoveTop: boolean;
  public hideMoveTopTimeout;

  public searchKeyword: string;

  public isLoading = false;

  public config: Config;
  public isBrowser;


  public loadingStories = [];
  protected buffer: Story[] = [];
  private readonly loadingStoryNumber = 10;
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
      protected articleService: ArticleService
  ) {
    super();
  }

  public ngOnInit(): void {

      this.loadingStories = Array(this.loadingStoryNumber).fill('');

      this.isBrowser = typeof window !== 'undefined';
      const {id,category} = this.route.children[0].snapshot?.params;
      this.openningStory = {id,category};
      this.loadOpenningStory();

      if (this.isNode) {
        return;
      }
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
      this.registerOnSearch();
      this.registerConfigChange();
      this.registerSpinner();

      this.stories$.subscribe(data=>{
        console.log(data);
      });

  }

  public loadOpenningStory():void {
      this.getFirstStory().subscribe((story) => {
          if (story === undefined) {
              return;
          }
          this.openningStory.story = story;
          this.openningStory.story.isAutoOpen = true;
          this.openningStory.story.isActive = true;
          this.storyList.selectStory(this.openningStory.id);
      });
  }
  public onSelectedStory(selectedStoryIndex: number): void {
      if (this.selectedStory) {
          this.selectedStory.isActive = false;
      }
      this.selectedStory = this.getStories()[selectedStoryIndex];
      this.selectedStory.isActive = true;

  }


  public autoSelectFirstStory(): void {
      if (!this.isSmallScreen && !this.openningStory.id) {
          setTimeout(() => {
              this.storyComponents.first?.onSelectStory();
          });
      }
      this.afterInitStories();
  }


  public loadMoreStories(): void {
      if (this.isNode) {
          return;
      }
      if (this.isLoading) {
          return;
      }
      this.isLoading = true;
      this.getLoadMoreObservable()
      .pipe(takeUntil(this.$stopGetStories), throttle(() => interval(10000)))
      .subscribe((value) => {
          this.stories$.next([...this.stories$.getValue(),...value]);
          this.isLoading = false;
      });
  }
  protected scrollTo(story: Story): void {
      setTimeout(() => {
          const index = this.stories$.getValue().findIndex((i) => i.id === story.id);
          const el = this.storyComponents.toArray()[Math.max(0, index)].getElement();
          this.scrollingBlock.nativeElement.scrollTo?.({ top: el.offsetTop, behavior: 'smooth' });
      });
  }

  protected scrollTop(): void {
      if (this.isNode) {
          return;
      }
      setTimeout(() => {
          this.scrollingBlock?.nativeElement?.scrollTo?.({ top: 0, behavior: 'smooth' });
      });

  }


  protected resetStoryList(): void {
      // this.stories = [];
      const hasSwitchCategory = !this.openningStory.category || this.category !== this.openningStory.category;
      if (hasSwitchCategory) {
          this.openningStory = {};
          this.scrollTop();
      }
      this.storyService.resetPageNumber();
  }

  protected loadFirstPage(): void {
    console.log('load first page');
      this.isLoading = true;
      this.storyService.getStories(this.category, 10)
          .pipe(takeUntil(this.$stopGetStories)).subscribe((value) => {
              const stories: Story[] = value.filter((s) => s.id !== this.openningStory.id);
              this.pushStory(...stories);

              this.isLoading = false;
              this.autoSelectFirstStory();
          });
  }

  private afterInitStories() {
      if(!this.openningStory.id){
          this.scrollTop();
      }
  }


  private updateStoryList() {
      this.route.params.subscribe(({category}) => {
          this.$stopGetStories.next();

          this.category = category as string;
          this.resetStoryList();

          this.loadFirstPage();
          this.configService.updateConfig({ category: this.category });

      });
  }


  private getFirstStory(): Observable<Story> {
      return new Observable((observer) => {
          const params = this.route.children[0].snapshot?.params;
          if (params?.id) {
              const articleId = params.id as string;
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
              this.storyService.search(keyword).subscribe((values) => this.pushStory(...values));
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

  pushStory(...story: Story[]): void{
    this.stories$.next([...this.stories$.getValue(),...story]);
  }

  getStories(): Story[]{
    return this.stories$.getValue();
  }

}
