import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, mapTo, takeUntil, tap } from 'rxjs/operators';
import * as url from 'speakingurl';
import { Story } from '../../../../../model/Story';
import { StoryComponent } from '../story/story.component';
import { IS_MOBILE, IS_NODE } from './../../shared/const';
import { StoryListService } from './story-list.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
})
export class StoryListComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input()
  firstStory: { story?: Observable<Story>; id: string };

  @ViewChild('scrollingBlock')
  public scrollingBlock: ElementRef<HTMLElement>;

  @ViewChildren(StoryComponent)
  public storyComponents: QueryList<StoryComponent>;

  @Output()
  loadMoreStories = new EventEmitter();
  @Input()
  public stories: Story[] = [];
  @Input()
  public category: string;
  public scrollPosition$: Observable<number>;

  loadingStories = Array(20).fill('');
  protected onDestroy$ = new Subject<void>();

  private _selectedStory: Story;
  public get selectedStory(): Story {
    return this._selectedStory;
  }
  public set selectedStory(value: Story) {
    this._selectedStory = value;
    this.selectStory(value);
  }

  constructor(
    @Inject(IS_NODE) public isNode: boolean,
    private storyListService: StoryListService,
    protected activatedRoute: ActivatedRoute,
    protected route: Router
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollTop());
    this.scrollPosition$ = fromEvent(this.scrollingBlock?.nativeElement, 'scroll').pipe(map((a) => (a.target as HTMLElement).scrollTop));
  }

  ngOnInit(): void {
    this.registerPrevAndNext();
  }
  ngOnChanges(): void {
    this.selectFirstStory();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public onSelectedStory(story: Story): void {
    this.selectedStory = story;
  }

  public trackByFn(_index: number, item: Story): unknown {
    return item.id;
  }

  public selectStory(story: Story): void {
    this.route.navigate([url(story.title), story.id], { relativeTo: this.activatedRoute });
    this.scrollTo(story);
  }

  protected selectFirstStory(): void {
    if (this.selectedStory != null) {
      return;
    }
    if (this.firstStory != null) {
      this.firstStory.story.pipe(takeUntil(this.onDestroy$)).subscribe((story) => (this.selectedStory = story));
      return;
    }

    if (this.stories?.length > 0 && this.firstStory?.id == null) {
      this.selectedStory = this.stories[0];
    }
  }

  protected scrollTo(story: Story): void {
    const index = this.stories.findIndex((i) => i.id === story.id);
    const el = this.storyComponents.toArray()[Math.max(0, index)].getElement();
    this.scrollingBlock.nativeElement.scrollTo?.({ top: el.offsetTop - 20, behavior: 'smooth' });
  }

  protected scrollTop(): void {
    if (this.isNode) {
      return;
    }
    setTimeout(() => {
      this.scrollingBlock?.nativeElement?.scrollTo?.({ top: 0, behavior: 'smooth' });
    });
  }

  private registerPrevAndNext() {
    merge(this.storyListService.onPrev().pipe(mapTo(-1)), this.storyListService.onNext().pipe(mapTo(1))).subscribe((adj) => {
      if (this.stories.length === 0) {
        return;
      }
      const index = Math.max(0, this.stories.indexOf(this.selectedStory) + adj);
      this.selectedStory = this.stories[index];
      this.scrollTo(this.stories[index]);
    });
  }
}
