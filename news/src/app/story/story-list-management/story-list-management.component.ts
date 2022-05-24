import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { pairwise, takeUntil, throttle } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import { DestroySubscriber } from 'src/app/shared/destroy-subscriber';
import { getArticleHistory } from 'src/app/store/actions';
import { Story } from '../../../../../model/Story';
import StoryImage from '../../../../../model/StoryImage';
import StoryMeta from '../../../../../model/StoryMeta';
import { ArticleService } from '../../shared/article.service';
import { Config, ConfigService } from '../../shared/config.service';
import { LoadingEventName, LoadingEventType, LoadingService } from '../../shared/loading.service';
import { StoryService } from '../../shared/story.service';
import { StoryListComponent } from '../story-list/story-list.component';
import { StoryListService } from '../story-list/story-list.service';
import { IS_NODE } from './../../shared/const';
@Component({
  selector: 'app-story-list-management',
  templateUrl: './story-list-management.component.html',
  styleUrls: ['./story-list-management.component.scss'],
})
export class StoryListManagementComponent extends DestroySubscriber implements OnInit {
  @ViewChild(StoryListComponent)
  public storyList: StoryListComponent;

  public stories$ = new BehaviorSubject<Story[]>([]);

  public openningStory: { id?: string; story?: Story; category?: string } = {};

  public category: string;

  public searchKeyword: string;

  public isLoading = false;

  public config: Config;

  protected buffer: Story[] = [];
  private selectedStory: Story;

  private $stopGetStories = new Subject();

  public constructor(
    protected storyService: StoryService,
    protected activatedRoute: ActivatedRoute,
    protected route: ActivatedRoute,
    protected router: Router,
    protected storyListService: StoryListService,
    @Inject(IS_MOBILE) public isSmallScreen: boolean,
    @Inject(IS_NODE) public isNode: boolean,
    protected configService: ConfigService,
    protected loadingService: LoadingService,
    protected articleService: ArticleService,
    protected store: Store<{ articleHistory }>
  ) {
    super();
  }

  public ngOnInit(): void {
    this.store.subscribe((data) => console.log(data.articleHistory));
    this.store.dispatch(getArticleHistory());
    const { id, category } = this.route.children[0].snapshot?.params;
    this.openningStory = { id, category };
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
    this.registerConfigChange();
    this.registerSpinner();
  }

  public loadOpenningStory(): void {
    this.getFirstStory().subscribe((story) => {
      if (story === undefined) {
        return;
      }
      this.openningStory.story = story;
      this.openningStory.story.isActive = true;
    });
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
      .pipe(
        takeUntil(this.$stopGetStories),
        throttle(() => interval(10000))
      )
      .subscribe((value) => {
        this.pushStory(...value);
        this.isLoading = false;
      });
  }

  protected resetStoryList(): void {
    this.stories$.next([]);
    const hasSwitchCategory = !this.openningStory.category || this.category !== this.openningStory.category;
    if (hasSwitchCategory) {
      this.openningStory = {};
    }
    this.storyService.resetPageNumber();
  }

  protected loadFirstPage(): void {
    this.isLoading = true;
    this.storyService
      .getStories(this.category, 10)
      .pipe(takeUntil(this.$stopGetStories))
      .subscribe((value) => {
        const stories: Story[] = value.filter((s) => s.id !== this.openningStory.id);
        this.pushStory(...stories);

        this.isLoading = false;
      });
  }

  private updateStoryList() {
    this.route.params.subscribe(({ category }) => {
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
          const storyMeta = new StoryMeta(article.sourceName!, article.sourceIcon!, article.time as number);
          const story = new Story(articleId, article.header, article.description, [storyImage], article.sourceUrl, storyMeta, false, true);
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
    this.configService
      .getConfig()
      .pipe(this.getTakeUntilDestroy(), pairwise())
      .subscribe(([oldConfig, newConfig]) => {
        this.config = newConfig;
        if (oldConfig.smallImage !== newConfig.smallImage) {
          this.resetStoryList();
          this.loadFirstPage();
        }
      });
  }

  private getLoadMoreObservable(): Observable<Story[]> {
    const category = this.route!.firstChild!.snapshot.paramMap.get('category');
    return this.storyService.getStories(category!);
  }

  pushStory(...story: Story[]): void {
    const unDuplicatedStories = story.filter((s) => this.stories$.getValue().indexOf(s) === -1).filter((s) => s.id !== this.openningStory?.id);
    this.stories$.next([...this.stories$.getValue(), ...unDuplicatedStories]);
  }

  getStories(): Story[] {
    return this.stories$.getValue();
  }
}
