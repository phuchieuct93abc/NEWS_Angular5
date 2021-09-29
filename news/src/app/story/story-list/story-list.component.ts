import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import * as url from 'speakingurl';
import { Story } from '../../../../../model/Story';
import { StoryComponent } from '../story/story.component';
import { IS_MOBILE, IS_NODE } from './../../shared/const';
import { StoryListService } from './story-list.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryListComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('scrollingBlock')
  public scrollingBlock: ElementRef<HTMLElement>;

  @ViewChildren(StoryComponent)
  public storyComponents: QueryList<StoryComponent>;

  @Output()
  loadMoreStories = new EventEmitter();
  @Input()
  public stories: Story[] = [];

  @Input()
  openningStory: Story;

  loadingStories = Array(10).fill('');
  @Input()
  public category: string;

  private selectedStory: Story;
  public scrollPosition$: Observable<number>;
  constructor(
    @Inject(IS_NODE) public isNode: boolean,
    @Inject(IS_MOBILE) private isMobile: boolean,
    private storyListService: StoryListService,
    protected activatedRoute: ActivatedRoute,
    protected route: Router
  ) {}

  ngAfterViewInit(): void {
    this.scrollPosition$ = fromEvent(this.scrollingBlock.nativeElement, 'scroll').pipe(map((a) => (a.target as HTMLElement).scrollTop));
  }

  ngOnInit(): void {
    this.registerPrevAndNext();
  }
  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes.stories?.currentValue as Story[];
    const previousValue = changes.stories?.previousValue as Story[];
    const isFirstTime = previousValue === undefined || previousValue.length === 0;
    this.handleScrollTop(currentValue);
    this.appendOpenningStory();
    this.handleSelectFirstStory(isFirstTime, currentValue);
  }
  private handleSelectFirstStory(isFirstTime: boolean, currentValue: Story[]) {
    if (this.isMobile && isFirstTime && this.openningStory) {
      this.selectStory(this.stories[0]);
      return;
    }
    if (!this.isMobile && isFirstTime && currentValue?.length > 0) {
      this.selectStory(this.stories[0]);
    }
  }

  private appendOpenningStory() {
    if (this.openningStory) {
      this.stories = [this.openningStory, ...this.stories];
    }
  }

  private handleScrollTop(currentValue: Story[]) {
    if (currentValue?.length === 0) {
      this.scrollTop();
    }
  }

  private registerPrevAndNext() {
    merge(this.storyListService.onPrev().pipe(mapTo(-1)), this.storyListService.onNext().pipe(mapTo(1))).subscribe((adj) => {
      if (this.stories.length === 0) {
        return;
      }
      const index = Math.max(0, this.stories.indexOf(this.selectedStory) + adj);
      this.selectStory(this.stories[index]);
      this.scrollTo(this.stories[index]);
    });
  }

  public onSelectedStory(story: Story): void {
    this.selectedStory = story;
  }

  public trackByFn(item: any): any {
    return item.id;
  }

  public selectStory(story: Story): void {
    this.route.navigate([url(story.title!), story.id], { relativeTo: this.activatedRoute });
  }

  protected scrollTo(story: Story): void {
    const index = this.stories.findIndex((i) => i.id == story.id);
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
}
