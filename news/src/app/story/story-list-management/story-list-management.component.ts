import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { IS_MOBILE } from 'src/app/shared/const';
import { configFeature } from 'src/app/store/config.reducer';
import { loadMoreStory, storyFeature } from 'src/app/store/story.reducer';
import { Story } from '../../../../../model/Story';
import StoryImage from '../../../../../model/StoryImage';
import StoryMeta from '../../../../../model/StoryMeta';
import { ArticleService } from '../../shared/article.service';
import { ConfigService } from '../../shared/config.service';
import { LoadingEventName, LoadingEventType, LoadingService } from '../../shared/loading.service';
import { StoryService } from '../../shared/story.service';
import { StoryListService } from '../story-list/story-list.service';
import { IS_NODE } from './../../shared/const';
@Component({
  selector: 'app-story-list-management',
  templateUrl: './story-list-management.component.html',
  styleUrls: ['./story-list-management.component.scss'],
})
export class StoryListManagementComponent implements OnInit, OnDestroy {
  public stories$ = this.store.select(storyFeature.selectStories).pipe(map((stories) => {}));

  public openingStory: { id: string; story?: Observable<Story>; category: string } | null = null;

  public isLoading = false;

  public smallImageConfig$ = this.store.select(configFeature.selectSmallImage).pipe(distinctUntilChanged());
  public category$ = this.store.select(storyFeature.selectCategory).pipe(tap(() => this.resetStoryList()));
  protected buffer: Story[] = [];

  private onDestroy$ = new Subject<void>();

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
    protected store: Store
  ) {}

  public ngOnInit(): void {
    this.loadFirstStory();

    if (this.isNode) {
      return;
    }
    this.updateStoryList();
    this.registerSpinner();
  }

  public loadFirstStory(): void {
    const { id, category } = this.route.children[0].snapshot?.params as { id: string; category: string };
    if (id == null) {
      return;
    }
    this.openingStory = { id, category, story: this.getFirstStory().pipe(shareReplay({ refCount: false, bufferSize: 1 })) };
  }

  public loadMoreStories(): void {
    if (this.isNode) {
      return;
    }
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.store.dispatch(loadMoreStory());
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  protected resetStoryList(): void {
    console.log('reset');
    this.openingStory = null;
  }

  private updateStoryList() {
    // this.route.params
    //   .pipe(
    //     map(({ category }) => category as string),
    //     tap(() => (this.isLoading = true)),
    //     tap((category) => (this.category = category)),
    //     tap(() => this.resetStoryList()),
    //     switchMap((category) => this.storyService.getStories(category, 20)),
    //     takeUntil(this.onDestroy$)
    //   )
    //   .subscribe((value) => {
    //     const stories: Story[] = value.filter((s) => s.id !== this.openingStory?.id);
    //     this.pushStory(...stories);
    //     this.isLoading = false;
    //     this.store.dispatch(updateConfigAction({ category: this.category }));
    //   });
  }

  private getFirstStory(): Observable<Story> {
    return new Observable((observer) => {
      const params = this.route.children[0].snapshot?.params;
      if (params?.id) {
        const articleId = params.id as string;
        this.articleService
          .getById(articleId, params.category as string)
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((article) => {
            const storyImage: StoryImage = new StoryImage(article.getThumbnail());
            const storyMeta = new StoryMeta(article.sourceName, article.sourceIcon, article.time as number);
            const story = new Story(articleId, article.header, article.description, [storyImage], article.sourceUrl, storyMeta, false, true);
            article.story = Object.assign(new Story(), story);
            story.article = article;
            observer.next(story);
            observer.complete();
          });
      } else {
        observer.complete();
      }
    });
  }

  private registerSpinner() {
    if (typeof window !== 'undefined') {
      this.loadingService.onLoading.pipe(takeUntil(this.onDestroy$)).subscribe((event) => {
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
}
